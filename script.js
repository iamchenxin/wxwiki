/**
 *  We handle several device classes based on browser width.
 *
 *  - desktop:   > __tablet_width__ (as set in style.ini)
 *  - mobile:
 *    - tablet   <= __tablet_width__
 *    - phone    <= __phone_width__
 */
var device_class = ''; // not yet known
var device_classes = 'desktop mobile tablet phone';

function tpl_dokuwiki_mobile(){

    // the z-index in mobile.css is (mis-)used purely for detecting the screen mode here
    var screen_mode = jQuery('#screen__mode').css('z-index') + '';

    // determine our device pattern
    // TODO: consider moving into dokuwiki core
    switch (screen_mode) {
        case '1':
            if (device_class.match(/tablet/)) return;
            device_class = 'mobile tablet';
            break;
        case '2':
            if (device_class.match(/phone/)) return;
            device_class = 'mobile phone';
            break;
        default:
            if (device_class == 'desktop') return;
            device_class = 'desktop';
    }

    jQuery('html').removeClass(device_classes).addClass(device_class);

    // handle some layout changes based on change in device
    var $handle = jQuery('#dokuwiki__aside h3.toggle');
    var $toc = jQuery('#dw__toc h3');

    if (device_class == 'desktop') {
        // reset for desktop mode
        if($handle.length) {
            $handle[0].setState(1);
            $handle.hide();
        }
        if($toc.length) {
            $toc[0].setState(1);
        }
    }
    if (device_class.match(/mobile/)){
        // toc and sidebar hiding
        if($handle.length) {
            $handle.show();
            $handle[0].setState(-1);
        }
        if($toc.length) {
            $toc[0].setState(-1);
        }
    }
}

jQuery(function(){
    var resizeTimer;
    dw_page.makeToggle('#dokuwiki__aside h3.toggle','#dokuwiki__aside div.content');

    tpl_dokuwiki_mobile();
    jQuery(window).bind('resize',
        function(){
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(tpl_dokuwiki_mobile,200);
        }
    );

    // increase sidebar length to match content (desktop mode only)
    var $sidebar = jQuery('.desktop #dokuwiki__aside');
    if($sidebar.length) {
        var $content = jQuery('#dokuwiki__content div.page');
        $content.css('min-height', $sidebar.height());
    }
});

function xxexpandcontent(){
    if( document.getElementById("xxexpandcon").style.maxWidth == "100%"){
        jQuery(".desktop #xxsidebar").slideDown(500);
        document.getElementById("xxexpandcon").style.maxWidth = "75em";

    }else{
        jQuery(".desktop #xxsidebar").hide();
        document.getElementById("xxexpandcon").style.maxWidth = "100%";
    }
}

function sidebar_toggle() {
  jQuery(".desktop #xxsidebar").slideToggle();
}
/*
 http://stackoverflow.com/questions/1038746/equivalent-of-string-format-in-jquery
 */
String.prototype.format = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function (m, n) { return args[n]; });
};

function WxWindow(name, clientwin,top, left, width, height) {
  this.top = top?top: "2%";
  this.left = left?left: "2%";
  this.width = width?width: "auto";
  this.height = height?height: "auto";

  var divstr='<div class="wx_WxWindow" id="wx_WxWindow_{0}" winid="{0}" ><div class="wx_clientwin">{1}</div> <div style="clear: both"></div>\
    <input name="close" class="wx_button_r wx_close" type="button" value="close"> </div> '.format(name, clientwin);
  this.jqwin=jQuery(divstr);
  jQuery('body').append(this.jqwin);
  this.jqwin.draggable();
  this.jqwin.children("input[name='close']").click(function(){
      jQuery(this).parent().slideUp(500);
  });

  if(jQuery("html").hasClass("phone")){
    this.jqwin.css("width","100%");
    this.jqwin.css("height",this.height);
    this.jqwin.css("top",this.top);
    this.jqwin.css("left","0%");
  }else{
    this.jqwin.css("width",this.width);
    this.jqwin.css("height",this.height);
    this.jqwin.css("top",this.top);
    this.jqwin.css("left",this.left);
  }
}
WxWindow.prototype.get_closebt=function(){return this.jqwin.children(".wx_close");};
WxWindow.prototype.getwin=function(){return this.jqwin;};
WxWindow.prototype.getwinid=function(){return this.jqwin.attr("winid");};
WxWindow.prototype.getclientwin=function(){return this.jqwin.children(".wx_clientwin");};

function bind_wx() {

}
var wx_bind_window = null;
jQuery(function() {

  jQuery('#wx_bind_wx').click(function (e) {
    if (wx_bind_window == null) {
      wx_bind_window = new WxWindow('wx_bind_wx',
      '请输入微信收到的验证码:<br/><textarea class="wx_edit_area" name="wx_edit" class="edit"></textarea>\
      <input name="wx_send" class="wx_button_r" type="button" value="确认验证码">',
        e.pageY, e.pageX);
    }
    wx_bind_window.getwin().slideDown(500);
    jQuery.ajax({
        url:'http://p.z.cc/hi'
    }).done( function(rt) {
        console.log(rt);
        wx_bind_window.getclientwin().append(jQuery("<h1>").text(rt));
       // jQuery("<h1>").text(rt).appendTo(wx_bind_window.getclientwin());
    });
  })
});
