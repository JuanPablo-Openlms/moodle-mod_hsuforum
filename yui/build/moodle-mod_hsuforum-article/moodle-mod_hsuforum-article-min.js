YUI.add("moodle-mod_hsuforum-article",function(r,o){var i,a="hsuforum-thread-edit",d="hsuforum-post-edit",u={ADD_DISCUSSION:"#newdiscussionform input[type=submit]",ADD_DISCUSSION_TARGET:".hsuforum-add-discussion-target",ALL_FORMS:".hsuforum-reply-wrapper form",CONTAINER:".mod-hsuforum-posts-container",CONTAINER_LINKS:".mod-hsuforum-posts-container a",DISCUSSION:".hsuforum-thread",DISCUSSIONS:".hsuforum-threads-wrapper",DISCUSSION_EDIT:"."+a,DISCUSSION_BY_ID:'.hsuforum-thread[data-discussionid="%d"]',DISCUSSION_COUNT:".hsuforum-discussion-count",DISCUSSION_TARGET:".hsuforum-new-discussion-target",DISCUSSION_TEMPLATE:"#hsuforum-discussion-template",DISCUSSION_VIEW:".hsuforum-thread-view",EDITABLE_MESSAGE:"[contenteditable]",EDITABLE_MESSAGE_ATTO:'[id^="editor-target-container"][contenteditable]:not([style*="display: none"])',FORM:".hsuforum-form",FORM_ADVANCED:".hsuforum-use-advanced",FORM_REPLY_WRAPPER:".hsuforum-reply-wrapper",INPUT_FORUM:'input[name="forum"]',INPUT_MESSAGE:'textarea[name="message"]',INPUT_REPLY:'input[name="reply"]',INPUT_SUBJECT:'input[name="subject"]',LINK_CANCEL:".hsuforum-cancel",NO_DISCUSSIONS:".forumnodiscuss",NOTIFICATION:".hsuforum-notification",OPTIONS_TO_PROCESS:".hsuforum-options-menu.unprocessed",PLACEHOLDER:".thread-replies-placeholder",POSTS:".hsuforum-thread-replies",POST_BY_ID:'.hsuforum-post-target[data-postid="%d"]',POST_EDIT:"."+d,POST_TARGET:".hsuforum-post-target",RATE:".forum-post-rating",RATE_POPUP:".forum-post-rating a",REPLY_TEMPLATE:"#hsuforum-reply-template",SEARCH_PAGE:"#page-mod-hsuforum-search",VALIDATION_ERRORS:".hsuforum-validation-errors",VIEW_POSTS:".hsuforum-view-posts"},s="discussion:created",l="discussion:deleted",h="form:canceled",f="post:created",c="post:deleted",m="post:updated";function e(){e.superclass.constructor.apply(this,arguments)}function t(){t.superclass.constructor.apply(this,arguments)}function n(){n.superclass.constructor.apply(this,arguments)}M.mod_hsuforum=M.mod_hsuforum||{},e.NAME="moodle-mod_hsuforum-dom",e.ATTRS={io:{value:null}},r.extend(e,r.Base,{initializer:function(){r.all(u.RATE).addClass("processed"),this.initOptionMenus()},initFeatures:function(){this.initOptionMenus(),this.initRatings()},initRatings:function(){r.all(u.RATE).each(function(e){e.hasClass("processed")||(M.core_rating.Y=r,e.all("select.postratingmenu").each(M.core_rating.attach_rating_events,M.core_rating),e.all("input.postratingmenusubmit").setStyle("display","none"),e.addClass("processed"))})},initOptionMenus:function(){r.all(u.OPTIONS_TO_PROCESS).each(function(e){e.removeClass("unprocessed");var t=new r.YUI2.widget.Menu(e.generateID(),{lazyLoad:!0});t.render(r.one(u.CONTAINER).generateID()),r.one("#"+e.getData("controller")).on("click",function(e){e.preventDefault(),t.cfg.setProperty("y",e.currentTarget.getY()+e.currentTarget.get("offsetHeight")),t.cfg.setProperty("x",e.currentTarget.getX()),t.show()})})},handleViewRating:function(e){null===e.currentTarget.ancestor(".helplink")&&(e.preventDefault(),openpopup(e,{url:e.currentTarget.get("href")+"&popup=1",name:"ratings",options:"height=400,width=600,top=0,left=0,menubar=0,location=0,scrollbars,resizable,toolbar,status,directories=0,fullscreen=0,dependent"}))},markPostAsRead:function(e,t,n){this.get("io").send({postid:e,action:"markread"},t,n)},incrementDiscussionCount:function(e){var t=r.one(u.DISCUSSION_COUNT);null!==t&&(t.setData("count",parseInt(t.getData("count"),10)+e),t.setHTML(M.util.get_string("xdiscussions","mod_hsuforum",t.getData("count"))))},displayNotification:function(e){var t=r.Node.create(e);r.one(u.NOTIFICATION).append(t),setTimeout(function(){t.remove(!0)},1e4)},handleNotification:function(e){r.Lang.isString(e.notificationhtml)&&0<e.notificationhtml.trim().length&&this.displayNotification(e.notificationhtml)},handleUpdateDiscussion:function(e){var t=r.one("#discussionsview");t?t.setHTML(e.html):(t=r.one(u.DISCUSSION_BY_ID.replace("%d",e.discussionid)))?(t.replace(e.html),this.initRatings()):r.one(u.DISCUSSION_TARGET).insert(e.html,"after")},handleDiscussionCreated:function(){r.one(u.NO_DISCUSSIONS)&&r.one(u.NO_DISCUSSIONS).remove()},handleDiscussionDeleted:function(e){var t=r.one(u.POST_BY_ID.replace("%d",e.postid));null!==t&&t.hasAttribute("data-isdiscussion")&&(r.one(u.DISCUSSIONS)?(t.remove(!0),this.incrementDiscussionCount(-1),r.one(u.DISCUSSION_COUNT).focus()):window.location.href=e.redirecturl)}}),M.mod_hsuforum.Dom=e,i=r.Base.create("hsuforumRouter",r.Router,[],{initializer:function(){},discussion:function(e){this.get("article").viewDiscussion(e.query.d,e.query.postid)},post:function(e){r.Lang.isUndefined(e.query.reply)?r.Lang.isUndefined(e.query.forum)?r.Lang.isUndefined(e.query["delete"])?r.Lang.isUndefined(e.query.edit)?r.Lang.isUndefined(e.query.prune)||(window.location.href=e.url):this.get("article").get("form").showEditForm(e.query.edit):this.get("article").confirmDeletePost(e.query["delete"]):this.get("article").get("form").showAddDiscussionForm(e.query.forum):this.get("article").get("form").showReplyToForm(e.query.reply)},focusHash:function(e){var t=e.get("href").split("#");setTimeout(function(){try{r.one("#"+t[1]).ancestor("li").focus()}catch(e){}},300)},handleRoute:function(e){1!==e.button||e.ctrlKey||e.metaKey||e.currentTarget.hasClass("disable-router")||e.currentTarget.hasClass("autolink")||e.currentTarget.ancestor(".posting")?-1<e.currentTarget.get("href").indexOf("#")&&this.focusHash(e.currentTarget):this.routeUrl(e.currentTarget.get("href"))&&e.preventDefault()},routeUrl:function(e){return!!this.hasRoute(e)&&(this.save(this.removeRoot(e)),!0)},handleAddDiscussionRoute:function(e){var t;e.preventDefault(),"undefined"!=typeof e.currentTarget&&(t=(e=e.currentTarget.ancestor("form")).one(u.INPUT_FORUM).get("value"),this.save(e.get("action")+"?forum="+t))},handleViewDiscussion:function(e){var t="/discuss.php?d="+e.discussionid;r.Lang.isUndefined(e.postid)||(t=t+"&postid="+e.postid),this.save(t)},hideForms:function(e,t,n){this.get("article").get("form"
).removeAllForms(),n()}},{ATTRS:{article:{value:null},root:{valueFn:function(){return M.cfg.wwwroot.replace(this._regexUrlOrigin,"")+"/mod/hsuforum"}},routes:{value:[{path:"/view.php"},{path:"/discuss.php",callbacks:["hideForms","discussion"]},{path:"/post.php",callbacks:["hideForms","post"]}]}}}),M.mod_hsuforum.Router=i,t.NAME="moodle-mod_hsuforum-form",t.ATTRS={io:{value:null}},r.extend(t,r.Base,{handlePostToGroupsToggle:function(e){var t=e.currentTarget.ancestor("form"),t=t.one("#menugroupinfo");e.currentTarget.get("checked")?t.set("disabled","disabled"):t.set("disabled","")},handleTimeToggle:function(e){e.currentTarget.get("checked")?e.currentTarget.ancestor(".fdate_time_selector").all("select").removeAttribute("disabled"):e.currentTarget.ancestor(".fdate_time_selector").all("select").setAttribute("disabled","disabled")},_displayReplyForm:function(e){var t,n,o=r.one(u.REPLY_TEMPLATE).getHTML(),i=e.one(u.FORM_REPLY_WRAPPER);i instanceof r.Node?i.replace(o):e.append(o),i=e.one(u.FORM_REPLY_WRAPPER),this.attachFormWarnings(),i.one(u.INPUT_REPLY).setAttribute("value",e.getData("postid")),(t=i.one(u.FORM_ADVANCED)).setAttribute("href",t.getAttribute("href").replace(/reply=\d+/,"reply="+e.getData("postid"))),n=i.one("div[id^=editor-target-container-]"),t.on("click",function(e){t.setAttribute("href",t.getAttribute("href")+"&msgcontent="+n.get("textContent"))}),e.hasAttribute("data-ispost")&&i.one("legend").setHTML(M.util.get_string("replytox","mod_hsuforum",e.getData("author")))},_copyMessage:function(e){var t=e.one(u.EDITABLE_MESSAGE).get("innerHTML"),t=(t=(t=(t=(t=(t=null!==e.one(".editor_atto")?e.one(u.EDITABLE_MESSAGE_ATTO).get("innerHTML"):t).replace(/&amp;/g,"&")).replace(/&gt;/g,">")).replace(/&lt;/g,"<")).replace(/&quot;/g,'"')).replace(/&#39;/g,"'");e.one(u.INPUT_MESSAGE).set("value",t)},_submitReplyForm:function(t,n){var e,o;t.all("button").setAttribute("disabled","disabled"),this._copyMessage(t),e=t.all("form input[type=file]"),(o=r.one("#hiddenadvancededitordraftid"))&&((o=o.cloneNode()).id="hiddenadvancededitordraftidclone",t.one("form input").insert(o,"before")),this.get("io").submitForm(t.one("form"),function(e){e.yuiformsubmit=1,!0===e.errors?(t.one(u.VALIDATION_ERRORS).setHTML(e.html).addClass("notifyproblem"),t.all("button").removeAttribute("disabled")):n.call(this,e)},this,0<e._nodes.length)},attachFormWarnings:function(){require(["core_form/changechecker"],function(n){r.all(u.ALL_FORMS).each(function(e){var t;e.hasClass("form-checker-added")||(t=n.watchFormById(e.generateID()),e.addClass("form-checker-added"),e.one(u.EDITABLE_MESSAGE).on("keypress",n.markAllFormsAsDirty,t))})})},removeAllForms:function(){r.all(u.POSTS+" "+u.FORM_REPLY_WRAPPER).each(function(e){e.ancestor(u.DISCUSSION_EDIT)||e.ancestor(u.POST_EDIT)||e.remove(!0)});var e=r.one(u.ADD_DISCUSSION_TARGET);null!==e&&e.empty()},handleCancelForm:function(e){e.preventDefault();var t=e.target.ancestor(u.POST_TARGET);if(!t)return t=e.target.ancestor(u.ADD_DISCUSSION_TARGET),void e.target.ancestor(u.FORM_REPLY_WRAPPER).remove(!0);t.removeClass(d).removeClass(a),e.target.ancestor(u.FORM_REPLY_WRAPPER).remove(!0),this.fire(h,{discussionid:t.getData("discussionid"),postid:t.getData("postid")})},handleFormSubmit:function(e){e.preventDefault();e=e.currentTarget.ancestor(u.FORM_REPLY_WRAPPER);this._submitReplyForm(e,function(e){switch(e.eventaction){case"postupdated":case"postcreated":this.fire(m,e);break;case"discussioncreated":this.fire(s,e)}})},sendInProgressData:function(e){var t=r.one("div[id^=editor-target-container-]"),n=r.one("input[name=subject]"),o=e.target.getAttribute("href");o.includes("post.php?edit")||e.target.setAttribute("href",e.target.getAttribute("href")+"&msgcontent="+t.get("textContent")+"&subcontent="+n.get("value"))},showReplyToForm:function(e){e=r.one(u.POST_BY_ID.replace("%d",e));e.hasAttribute("data-ispost")&&this._displayReplyForm(e),e.one(u.EDITABLE_MESSAGE).focus()},setDateField:function(e,t,n){var n=new Date(1e3*n),o=n.getMinutes(),i=n.getHours(),s=n.getDate(),a=n.getMonth()+1,n=n.getFullYear();t?r.one("#id_time"+e+"_enabled").set("checked",!0):r.one("#id_time"+e+"_enabled").set("checked",!1),0<o&&60==(o=5*Math.round(o/5))&&(o=55),r.one("#id_time"+e+"_minute").set("value",o),r.one("#id_time"+e+"_hour").set("value",i),r.one("#id_time"+e+"_day").set("value",s),r.one("#id_time"+e+"_month").set("value",a),r.one("#id_time"+e+"_year").set("value",n),this.setDateFieldsClassState()},resetDateField:function(e){var t;r.one("#discussion_dateform fieldset")&&(t=Math.floor(Date.now()/1e3),this.setDateField(e,!1,t))},resetDateFields:function(){var e,t=["start","end"];for(e in t)this.resetDateField(t[e])},setDateFieldsClassState:function(){var e=r.one("fieldset.dateform_fieldset");e&&e.all(".fdate_selector").each(function(e){e.one("input").get("checked")?e.all("select").removeAttribute("disabled"):e.all("select").setAttribute("disabled","disabled")})},applyDateFields:function(){var o,e,t,n,i;if(r.one(".dateformtarget")){if((o=r.one("#discussion_dateform fieldset"))||((o=r.Node.create("<fieldset/>")).addClass("form-inline"),0<(e=r.all("#discussion_dateform div.row.fitem"))._nodes.length||(t=r.all("#discussion_dateform .form-inline.felement"),n=r.all(".col-form-label.d-inline"),i=[],n.each(function(e){i.push(e.ancestor())}),t.each(function(e,t){var n;0<t&&((n=r.Node.create("<div/>")).addClass("form-group"),o.appendChild(n),n.appendChild(i[t-1]).addClass("row"),n.appendChild(e).addClass("row"))})),e.each(function(e,t){0<t&&o.appendChild(e)})),!o)return;o.addClass("dateform_fieldset"),o.removeClass("hidden"),o.one("legend")&&o.one("legend").remove(),o.all("a.visibleifjs").addClass("disable-router"),r.one(".dateformtarget").append(o)}this.setDateFieldsClassState()},setDateFields:function(e,t){0==e&&this.resetDateField("start"),0==t&&this.resetDateField("end")},setDefaultDateSettings:function(){var e=r.one("#id_timestart_enabled").ancestor(".felement"),t=r.one("#id_timeend_enabled").ancestor(".felement");e.all(
"select").setAttribute("disabled","disabled"),t.all("select").setAttribute("disabled","disabled")},showAddDiscussionForm:function(){var t,n,o;r.one(u.ADD_DISCUSSION_TARGET).setHTML(r.one(u.DISCUSSION_TEMPLATE).getHTML()).one(u.INPUT_SUBJECT).focus(),this.resetDateFields(),this.applyDateFields(),this.attachFormWarnings();try{this.setDefaultDateSettings()}catch(e){}t=r.one(u.FORM_ADVANCED),n=r.one("div[id^=editor-target-container-]"),o=r.one("input[name=subject]"),t.on("click",function(e){t.setAttribute("href",t.getAttribute("href")+"&msgcontent="+n.get("textContent")+"&subcontent="+o.get("value"))})},showEditForm:function(e){var i,s=r.one(u.POST_BY_ID.replace("%d",e));s.hasClass(a)||s.hasClass(d)?s.one(u.EDITABLE_MESSAGE).focus():(i=this,e=r.one("#hiddenadvancededitordraftid"),this.get("io").send({discussionid:s.getData("discussionid"),postid:s.getData("postid"),draftid:e?e.get("value"):0,action:"edit_post_form"},function(e){var t,n,o;s.prepend(e.html),s.hasAttribute("data-isdiscussion")?s.addClass(a):s.addClass(d),s.one(u.EDITABLE_MESSAGE).focus(),e.isdiscussion&&(i.applyDateFields(),t=e.offset,0!=e.timestart||0!=e.timeend?(o=60*(new Date).getTimezoneOffset(),n=parseInt(e.timestart)+parseInt(o)+parseInt(t),o=parseInt(e.timeend)+parseInt(o)+parseInt(t),i.setDateFields(n,o)):i.setDateFields(e.timestart,e.timeend)),this.attachFormWarnings()},this))}}),M.mod_hsuforum.Form=t,n.NAME=o,n.ATTRS={contextId:{value:undefined},io:{readOnly:!0},dom:{readOnly:!0},router:{readOnly:!0},form:{readOnly:!0},liveLog:{readOnly:!0},currentEditLink:null},r.extend(n,r.Base,{initializer:function(){this._set("router",new M.mod_hsuforum.Router({article:this,html5:!1})),this._set("io",new M.mod_hsuforum.Io({contextId:this.get("contextId")})),this._set("dom",new M.mod_hsuforum.Dom({io:this.get("io")})),this._set("form",new M.mod_hsuforum.Form({io:this.get("io")})),this._set("liveLog",M.mod_hsuforum.init_livelog()),this.bind()},bind:function(){var e,t,n,o,i=document.getElementsByClassName("hsuforum-post-unread")[0];if(i&&"#unread"===location.hash){if(i=document.getElementById(i.id).parentNode,navigator.userAgent.match(/Trident|MSIE/)){for(e=i.offsetTop,t=i;t=t.offsetParent;)e+=t.offsetTop;window.scrollTo(0,e)}else i.scrollIntoView();i.focus()}null===r.one(u.SEARCH_PAGE)&&(i=this.get("dom"),n=this.get("form"),o=this.get("router"),r.delegate("click",n.handlePostToGroupsToggle,document,'.hsuforum-discussion input[name="posttomygroups"]',n),r.delegate("click",n.handleTimeToggle,document,"#id_timestart_enabled",n),r.delegate("click",n.handleTimeToggle,document,"#id_timeend_enabled",n),r.delegate("click",n.handleCancelForm,document,u.LINK_CANCEL,n),r.delegate("click",o.handleRoute,document,u.CONTAINER_LINKS,o),r.delegate("click",i.handleViewRating,document,u.RATE_POPUP,i),r.delegate("submit",n.handleFormSubmit,document,u.FORM,n),r.delegate("click",o.handleAddDiscussionRoute,document,u.ADD_DISCUSSION,o),r.delegate("click",n.sendInProgressData,document,u.FORM_ADVANCED,n),n.on(f,i.handleUpdateDiscussion,i),n.on(f,i.handleNotification,i),n.on(f,o.handleViewDiscussion,o),n.on(f,this.handleLiveLog,this),n.on(m,this.handlePostUpdated,this),n.on(s,i.handleUpdateDiscussion,i),n.on(s,i.handleDiscussionCreated,i),n.on(s,i.handleNotification,i),n.on(s,o.handleViewDiscussion,o),n.on(s,this.handleLiveLog,this),this.on(l,i.handleDiscussionDeleted,i),this.on(l,i.handleNotification,i),this.on(l,this.handleLiveLog,this),this.on(c,i.handleUpdateDiscussion,i),this.on(c,o.handleViewDiscussion,o),this.on(c,i.handleNotification,i),this.on(c,this.handleLiveLog,this),n.on(h,o.handleViewDiscussion,o))},handlePostUpdated:function(e){var t=this.get("dom"),n=(this.get("form"),this.get("router"));t.handleUpdateDiscussion(e),n.handleViewDiscussion(e),t.handleNotification(e),this.handleLiveLog(e)},handleLiveLog:function(e){r.Lang.isString(e.livelog)&&this.get("liveLog").logText(e.livelog)},viewDiscussion:function(e,t){var n,e=r.one(u.DISCUSSION_BY_ID.replace("%d",e));e instanceof r.Node&&(r.Lang.isUndefined(t)||null===(n=r.one(u.POST_BY_ID.replace("%d",t)))||n.hasAttribute("data-isdiscussion")?e:n.get("parentNode")).focus()},confirmDeletePost:function(e){null!==r.one(u.POST_BY_ID.replace("%d",e))&&!0===window.confirm(M.str.mod_hsuforum.deletesure)&&this.deletePost(e)},deletePost:function(e){var t=r.one(u.POST_BY_ID.replace("%d",e));null!==t&&this.get("io").send({postid:e,sesskey:M.cfg.sesskey,action:"delete_post"},function(e){t.hasAttribute("data-isdiscussion")?this.fire(l,e):this.fire(c,e)},this)}}),M.mod_hsuforum.Article=n,M.mod_hsuforum.init_article=function(e){new n(e)},M.mod_hsuforum.dispatchClick=function(e){var t;document.createEvent?(t=new MouseEvent("click",{view:window,bubbles:!0,cancelable:!0}),e.dispatchEvent(t)):e.fireEvent&&e.fireEvent("onclick")}},"@VERSION@",{requires:["base","node","event","router","core_rating","querystring","moodle-mod_hsuforum-io","moodle-mod_hsuforum-livelog"]});