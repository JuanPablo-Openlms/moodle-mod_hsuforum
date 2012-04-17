<?php

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Subscribe to or unsubscribe from a forum or manage forum subscription mode
 *
 * This script can be used by either individual users to subscribe to or
 * unsubscribe from a forum (no 'mode' param provided), or by forum managers
 * to control the subscription mode (by 'mode' param).
 * This script can be called from a link in email so the sesskey is not
 * required parameter. However, if sesskey is missing, the user has to go
 * through a confirmation page that redirects the user back with the
 * sesskey.
 *
 * @package    mod
 * @subpackage forum
 * @copyright  1999 onwards Martin Dougiamas  {@link http://moodle.com}
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once(dirname(dirname(dirname(__FILE__))).'/config.php');
require_once($CFG->dirroot.'/mod/hsuforum/lib.php');

$id      = required_param('id', PARAM_INT);             // the forum to subscribe or unsubscribe to
$mode    = optional_param('mode', null, PARAM_INT);     // the forum's subscription mode
$user    = optional_param('user', 0, PARAM_INT);        // userid of the user to subscribe, defaults to $USER
$sesskey = optional_param('sesskey', null, PARAM_RAW);  // sesskey

$url = new moodle_url('/mod/hsuforum/subscribe.php', array('id'=>$id));
if (!is_null($mode)) {
    $url->param('mode', $mode);
}
if ($user !== 0) {
    $url->param('user', $user);
}
if (!is_null($sesskey)) {
    $url->param('sesskey', $sesskey);
}
$PAGE->set_url($url);

$forum   = $DB->get_record('hsuforum', array('id' => $id), '*', MUST_EXIST);
$course  = $DB->get_record('course', array('id' => $forum->course), '*', MUST_EXIST);
$cm      = get_coursemodule_from_instance('hsuforum', $forum->id, $course->id, false, MUST_EXIST);
$context = get_context_instance(CONTEXT_MODULE, $cm->id);

if ($user) {
    require_sesskey();
    if (!has_capability('mod/hsuforum:managesubscriptions', $context)) {
        print_error('nopermissiontosubscribe', 'hsuforum');
    }
    $user = $DB->get_record('user', array('id' => $user), MUST_EXIST);
} else {
    $user = $USER;
}

if (isset($cm->groupmode) && empty($course->groupmodeforce)) {
    $groupmode = $cm->groupmode;
} else {
    $groupmode = $course->groupmode;
}
if ($groupmode && !hsuforum_is_subscribed($user->id, $forum) && !has_capability('moodle/site:accessallgroups', $context)) {
    if (!groups_get_all_groups($course->id, $USER->id)) {
        print_error('cannotsubscribe', 'hsuforum');
    }
}

require_login($course->id, false, $cm);

if (is_null($mode) and !is_enrolled($context, $USER, '', true)) {   // Guests and visitors can't subscribe - only enrolled
    $PAGE->set_title($course->shortname);
    $PAGE->set_heading($course->fullname);
    if (isguestuser()) {
        echo $OUTPUT->header();
        echo $OUTPUT->confirm(get_string('subscribeenrolledonly', 'hsuforum').'<br /><br />'.get_string('liketologin'),
                     get_login_url(), new moodle_url('/mod/hsuforum/view.php', array('f'=>$id)));
        echo $OUTPUT->footer();
        exit;
    } else {
        // there should not be any links leading to this place, just redirect
        redirect(new moodle_url('/mod/hsuforum/view.php', array('f'=>$id)), get_string('subscribeenrolledonly', 'hsuforum'));
    }
}

$returnto = optional_param('backtoindex',0,PARAM_INT)
    ? "index.php?id=".$course->id
    : "view.php?f=$id";

if (!is_null($mode) and has_capability('mod/hsuforum:managesubscriptions', $context)) {
    require_sesskey();
    switch ($mode) {
        case HSUFORUM_CHOOSESUBSCRIBE : // 0
            hsuforum_forcesubscribe($forum->id, 0);
            redirect($returnto, get_string("everyonecannowchoose", "hsuforum"), 1);
            break;
        case HSUFORUM_FORCESUBSCRIBE : // 1
            hsuforum_forcesubscribe($forum->id, 1);
            redirect($returnto, get_string("everyoneisnowsubscribed", "hsuforum"), 1);
            break;
        case HSUFORUM_INITIALSUBSCRIBE : // 2
            hsuforum_forcesubscribe($forum->id, 2);
            redirect($returnto, get_string("everyoneisnowsubscribed", "hsuforum"), 1);
            break;
        case HSUFORUM_DISALLOWSUBSCRIBE : // 3
            hsuforum_forcesubscribe($forum->id, 3);
            redirect($returnto, get_string("noonecansubscribenow", "hsuforum"), 1);
            break;
        default:
            print_error(get_string('invalidforcesubscribe', 'hsuforum'));
    }
}

if (hsuforum_is_forcesubscribed($forum)) {
    redirect($returnto, get_string("everyoneisnowsubscribed", "hsuforum"), 1);
}

$info->name  = fullname($user);
$info->forum = format_string($forum->name);

if (hsuforum_is_subscribed($user->id, $forum->id)) {
    if (is_null($sesskey)) {    // we came here via link in email
        $PAGE->set_title($course->shortname);
        $PAGE->set_heading($course->fullname);
        echo $OUTPUT->header();
        echo $OUTPUT->confirm(get_string('confirmunsubscribe', 'hsuforum', format_string($forum->name)),
                new moodle_url($PAGE->url, array('sesskey' => sesskey())), new moodle_url('/mod/hsuforum/view.php', array('f' => $id)));
        echo $OUTPUT->footer();
        exit;
    }
    require_sesskey();
    if (hsuforum_unsubscribe($user->id, $forum->id)) {
        add_to_log($course->id, "hsuforum", "unsubscribe", "view.php?f=$forum->id", $forum->id, $cm->id);
        redirect($returnto, get_string("nownotsubscribed", "hsuforum", $info), 1);
    } else {
        print_error('cannotunsubscribe', 'hsuforum', $_SERVER["HTTP_REFERER"]);
    }

} else {  // subscribe
    if ($forum->forcesubscribe == HSUFORUM_DISALLOWSUBSCRIBE &&
                !has_capability('mod/hsuforum:managesubscriptions', $context)) {
        print_error('disallowsubscribe', 'hsuforum', $_SERVER["HTTP_REFERER"]);
    }
    if (!has_capability('mod/hsuforum:viewdiscussion', $context)) {
        print_error('noviewdiscussionspermission', 'hsuforum', $_SERVER["HTTP_REFERER"]);
    }
    if (is_null($sesskey)) {    // we came here via link in email
        $PAGE->set_title($course->shortname);
        $PAGE->set_heading($course->fullname);
        echo $OUTPUT->header();
        echo $OUTPUT->confirm(get_string('confirmsubscribe', 'hsuforum', format_string($forum->name)),
                new moodle_url($PAGE->url, array('sesskey' => sesskey())), new moodle_url('/mod/hsuforum/view.php', array('f' => $id)));
        echo $OUTPUT->footer();
        exit;
    }
    require_sesskey();
    hsuforum_subscribe($user->id, $forum->id);
    add_to_log($course->id, "hsuforum", "subscribe", "view.php?f=$forum->id", $forum->id, $cm->id);
    redirect($returnto, get_string("nowsubscribed", "hsuforum", $info), 1);
}