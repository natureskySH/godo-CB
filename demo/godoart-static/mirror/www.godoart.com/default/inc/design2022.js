$(function(){
 // 고도미술 사이트 링크
 $("footer .link button").click(function(){
  $("footer .link").toggleClass("on");
 })

 if($("nav").hasClass("nav")) {
  // var cssTop = parseInt($("#sky").css("top"));
  //  $(window).scroll(function(){
  //   var position = $(window).scrollTop();
  //   $("#sky").stop().animate({"top":position+cssTop+"px"},500);
  // });
        if (!("ontouchstart" in document.documentElement)) { // desktop
            $('.nav ul a')
   .focus(function() {
       $(this).parents("li").addClass('on');
       $('.header').addClass('on');
      })
      .blur(function() {
       $(this).parents("li").removeClass('on');
                $('.header').removeClass('on');
      });
      $('.nav ul')
   .mouseover(function() {
       $(".header").addClass('on');
    $(this).parents("li").addClass('on');
      })
   .mouseout(function() {
    $(".header").removeClass('on');
    $(this).parents("li").removeClass('on');
      });
        }
        else { // mobile
            $('.nav > ul > li> a').click(function() {
       $('.header').addClass('on touchBk');
                return false;
      });
        }
  $('.navOpen').click(function() {
         $('header').addClass('on');
        })
        $('.navClose').click(function() {
         $('header').removeClass('on');
        })
        /*$('.header').click(function() {
         $('header').removeClass('on touchBk');
        })*/
  // nav 제일 갯수 많은 li기준으로 addClass 하기
  /*
  var m = 0;
  $('.nav ul ul').each(function(){
      if(m < $(this).children("li").length){
          m = $(this).children("li").length;
      }
  });
  $('.header').addClass("nav"+m)
  */
 };
 $(".btnTop").click(function(){
  $('html, body').animate({scrollTop: '0'}, 500);
  return false;
 });
 // 팝업 띄우기
 $("a.jsDiv").click(function(){
  var jsDivHref = $(this).attr("href");
  $(jsDivHref).addClass("on");
  var height = $(jsDivHref + "> .jsDivContent" ).height();
  $(jsDivHref + "> .jsDivContent" ).css("top","48%").css("margin-top", - height * 0.5 );
  $( ".jsDivContent" ).draggable();
  $("body").addClass("no_scroll");
  //return false;
 });
 $("a.jsDivClose").click(function(){
  $(this).parents(".jsDiv").removeClass("on")
  $("body").removeClass("no_scroll");
  return false;
 });

    // jsOn 해당 id에 클래스on 부여
 $("a.jsOn").click(function(){
  var jsOnHref = $(this).attr("href");
  $(jsOnHref).addClass("on");
  event.preventDefault();
 });
 $("a.jsOff").click(function(){
  var jsOffHref = $(this).attr("href");
  $(jsOffHref).removeClass("on")
  event.preventDefault();
 });


// 게시판 테이블에 박혀있는 인라인 스타일 제거
if($("div").hasClass("jsTable")){
 $("tr").removeAttr("height");
 $("td").removeAttr("width").removeAttr("align").removeAttr("height").removeAttr("style");
 $("input").removeAttr("width").removeAttr("align").removeAttr("height").removeAttr("style").removeAttr("font");
 $("font").removeAttr("style")
 };

// 게시판에 기본 링크되는 company.css 제거
if($("div").hasClass("jsDesignAdjust")){
$("#content .container link[rel=stylesheet]").remove();
$(".jsDesignAdjust img").css("height","auto");
};

if($("td").hasClass("est_keyword_cell")){
$("#search_display1").css("display","inline");
};

// 게시판 목록 하단의 검색 버튼 디자인 변경
if($("td").hasClass("est_btn_cell")){
$(".est_btn_cell input").attr("src","/base/img/images/search.png").attr("alt","검색").attr("class","iconSearch") //.attr("type","button").removeAttr("src").removeAttr("title").removeAttr("alt");
};

if($("td").hasClass("view_cell_main")){
// 게시판 상단 제목, 작성자, 작성일자 부분 디자인 변경
$("td.item_cell_subject:contains('제목')").addClass("title1").next().addClass("title1");
$("td.item_cell_subject:contains('작성자')").addClass("titleWriter").next().addClass("titleWriter");
$("td.item_cell_subject:contains('작성일자')").addClass("titleWDate").next().addClass("titleWDate");

// 게시판 하단 목록, 이전, 다음 버튼 디자인 변경
$("[src='/resource/skins/godo2018/list.gif']").attr("src","/base/img/images/iconList.gif").attr("alt","목록").attr("class","iconList");
$("[src='/resource/skins/godo2018/prev.gif']").attr("src","/base/img/images/iconBefore.gif").attr("alt","이전").attr("class","iconBefore");
$("[src='/resource/skins/godo2018/next.gif']").attr("src","/base/img/images/iconNext.gif").attr("alt","다음").attr("class","iconNext");
$("[src='/resource/skins/godo2018/write.gif']").attr("src","/base/img/images/iconWrite.gif").attr("alt","글쓰기").attr("class","iconWrite");
$("[src='/resource/skins/godo2018/modify.gif']").attr("src","/base/img/images/iconModify.gif").attr("alt","수정").attr("class","iconModify");
$("[src='/resource/skins/godo2018/delete.gif']").attr("src","/base/img/images/iconDelete.gif").attr("alt","삭제").attr("class","iconDelete");

};

if($("table").hasClass("gallery_item_table")){
// 겔러리 게시판 목록 이미지 사이즈 고정 제거
$(".item_cell_media img").removeAttr("width").removeAttr("height");
};


if($("span").hasClass("webzine_type_img")){
// 겔러리 게시판 목록 이미지 사이즈 고정 제거
$(".webzine_type_img img").removeAttr("width").removeAttr("height");
};


});


$(window).on('load', function(){
    if($("table").hasClass("gallery_item_table")){
        
        // 겔러리 게시판 목록 이미지 사이즈 고정 제거
        $(".item_cell_media img").removeAttr("width").removeAttr("height");
    };

    if($("span").hasClass("webzine_type_img")){
        // 겔러리 게시판 목록 이미지 사이즈 고정 제거
        $(".webzine_type_img img").removeAttr("width").removeAttr("height");
    };

});
