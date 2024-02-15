$(function(){
    const shoot_type_choose = $("button.photo_sample");
    const shoot_type_box = $(".type_item");
    const btn_logo = $(".logo > a");
    const box_camera = $(".shootihg_box");
    const box_preview = $(".shootihg_box .picture");
    const box_preview_item = $(".shootihg_box .picture li");
    const box_picture_setting = $(".picture_setting");
    const btn_frame_color = $(".btn.color");
    const btn_frame_spacial = $(".btn.spacial");
    const frame_chip_color = $(".frame_chips.frame_color");
    const frame_chip_spacial = $(".frame_chips.frame_spacial");
    const btn_frame_chip = $(".frame_chips button");
    const box_print = $(".box_print");
    const print_left_item = $(".box_print .print_set:not(.wide) .left li");
    const print_right_item = $(".box_print .print_set:not(.wide) .right li");
    const print_wide_item = $(".box_print .wide .left li");
    const btn_picture_preview =$(".picture_preview .preview_set button");
    const btn_print_minus = $(".set_count .btn_ic.minus");
    const btn_print_plus = $(".set_count .btn_ic.plus");
    const print_num = $(".set_count p");
    const btn_pritn = $(".btn.print");
    
    let shoot_type = window.localStorage.getItem("shoot type"); // basic , wide
    let cut_count = window.localStorage.getItem("cut count"); // 4,3,2,6
    let picture_ratio =window.localStorage.getItem("ratio"); // 1x1, 4x3, 3x4 
    let select_cut = $("." + shoot_type).find($('button.photo_sample[data-cut="'+ cut_count + '"]'));
    let picture_preview_item = $(".preview_set li");
    let shutter_chance = window.localStorage.getItem("shutter chance"); // 8, 6, 4
    let print_count = print_num.text();
    let photo_index = 0;

    /* 촬영 타입 선택 */
    shoot_type_choose.on('click', function(){
        shoot_type_box.removeClass('on'); // 선택표시 취소
        $(this).parents(".type_item").addClass('on'); //내가 선택한 촬영타입에 선택 표시
        
        // localStorage에 촬영 타입 저장
        window.localStorage.setItem("shoot type", $(this).attr('data-shoot-type'));
        window.localStorage.setItem("cut count", $(this).attr('data-cut'));
        window.localStorage.setItem("shutter chance", $(this).attr("data-shutter-chance"));
        window.localStorage.setItem("ratio", $(this).attr("data-ratio"));
    });

    /* step1으로 돌아왔을 때 선택한 촬영타입 표시되도록 클릭 */
    select_cut.trigger('click');

    /* 홈으로 갈 때 촬영타입 다시 세팅 */
    btn_logo.on('click', function(){
        window.localStorage.setItem("shoot type", "basic");
        window.localStorage.setItem("cut count", "4");
    });

    /* step2 화면에서 촬영가능 횟수(shutter_chance)에 따른 미리보기 갯수 & 비율 셋팅 */
    box_camera.addClass("ratio_" + picture_ratio); // 카메라 비율 설정
    box_preview.addClass("chance_" + shutter_chance); // 미리보기 갯수 설정
    // 미리보기 비율 설정
    if(picture_ratio == "4x3"){
        box_preview_item.css({width: "calc((100vh - 40px - var(--margin-base)) /" + shutter_chance + "* (4 / 3.17)"});
    } else if(picture_ratio == "1x1"){
        box_preview_item.css({width: "calc((100vh - 40px - var(--margin-base)) /" + shutter_chance + "* 1"});
    } else if(picture_ratio == "3x4"){
        box_preview_item.css({width: "calc((100vh - 40px - var(--margin-base)) /" + shutter_chance + "* (3 / 4)"});
    }

    /* step3 화면에서 인쇄미리보기와 찍은사진 미리보기 셋팅 */
    box_picture_setting.addClass("ratio_" + picture_ratio + " " + shoot_type);
    for(let i = 0; i < 8; i++){
        picture_preview_item.eq(i).children("button").css({backgroundImage: "url(" + localStorage.getItem("photo_" + i) + ")"});
    }

    /* 사진선택 기능 */
    btn_picture_preview.on('click', function(){
        if(photo_index < localStorage.getItem('cut count')){
            
            let select_photo = $(this).css("backgroundImage");
            $(this).attr("data-photo-inex", photo_index)
            print_left_item.eq(photo_index).css({backgroundImage: select_photo});
            print_right_item.eq(photo_index).css({backgroundImage: select_photo});
            print_wide_item.eq(photo_index).css({backgroundImage: select_photo});
            photo_index ++;
        }
    });
    
    
    /* 프레임 선택 버튼 */
    btn_frame_color.on('click', function(){
        frame_chip_color.show();
        frame_chip_spacial.addClass("hide");
    });
    btn_frame_spacial.on('click', function(){
        frame_chip_spacial.removeClass("hide");
        frame_chip_color.hide();
    });

    /* 프레임 칩 버튼 */
    btn_frame_chip.on('click', function(){
        window.localStorage.setItem("frame color", $(this).attr("data-frame"));
        box_print.removeClass().addClass("box_print " + window.localStorage.getItem("frame color"));
    });
    
    /* 인쇄매수 버튼 */
    btn_print_minus.on('click', function(){
        if(print_count > 0){
            print_count --;
            print_num.text(print_count);
        }
    });
    btn_print_plus.on('click', function(){
        print_count ++;
        print_num.text(print_count);
    });

    /* 인쇄시작버튼 */
    btn_pritn.on('click', function(){
        if(print_count == 0){
            alert("인쇄 매수를 추가해 주세요.")
        }
        setTimeout(function(){
            btn_pritn.addClass('hide').siblings().removeClass('hide');
        }, 3000);
        
    });
});