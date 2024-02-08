$(function(){
    const shoot_type_choose = $("button.photo_sample");
    const shoot_type_box = $(".type_item");
    const btn_logo = $(".logo > a");
    const btn_shutter = $(".btn.shutter");
    const shutter_timer = $(".set_timer");
    const box_camera = $(".shootihg_box");
    const box_preview = $(".shootihg_box .picture");
    const box_preview_item = $(".shootihg_box .picture li")

    let shoot_type = window.localStorage.getItem("shoot type"); // basic , wide
    let cut_count = window.localStorage.getItem("cut count"); // 4,3,2,6
    let picture_ratio =window.localStorage.getItem("ratio"); // 1x1, 4x3, 3x4 
    let select_cut = $("." + shoot_type).find($('button.photo_sample[data-cut="'+ cut_count + '"]'));
    let shutter_chance = window.localStorage.getItem("shutter chance"); // 8, 6, 4
    let timer = shutter_timer.text(); // 기본 timer 10
    let shutter_status = false; //촬영중 : true, 촬영 정지 : false 
    
    let camera = $(".video");
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
        box_preview_item.css({width: "calc((100vh - 40px - var(--margin-base)) /" + shutter_chance + "*1.333"});
    } else if(picture_ratio == "1x1"){
        box_preview_item.css({width: "calc((100vh - 40px - var(--margin-base)) /" + shutter_chance + "*1"});
    } else if(picture_ratio == "3x4"){
        box_preview_item.css({width: "calc((100vh - 40px - var(--margin-base)) /" + shutter_chance + "*0.75"});
    }

    // width: calc((100vh - 40px - var(--margin-base)) / 8 * 1.333);

    /* 촬영 시작 버튼 클릭 */
    btn_shutter.on('click', function(){
        if(!shutter_status){
            shutter_status = true;

            $(".btn_ic.prev").attr('disabled', true).click(function(){return false;}); // "이전"버튼 비활성화
            btn_shutter.attr('disabled', true); // "촬영시작"버튼 비활성화
            console.log("남은 셔터 수", shutter_chance);
            let reset_timer = timer;
            /* 촬영 타이머 카운트다운 */
            interval_count = setInterval(function(){
                timer --;
                shutter_timer.text(timer)
                
                if(timer >= 0){
                } else{
                    shutter_timer.text(reset_timer);
                    timer = shutter_timer.text();
                    shuter_status = false;
                    shutter_chance --;
                    console.log("남은 셔터 수", shutter_chance);
                    
                    if(shutter_chance == 0){
                        clearInterval(interval_count); // 남은 셔터수가 0되면 카운트다운 종료 
                        $(".btn_ic.next").removeClass('hide'); // "다음"버튼 노출
                    }
                }
            },1000);
            
        }

        /* 카메라 실행 */
        let stream = navigator.mediaDevices.getUserMedia({video: true, audio:false});
        camera.srcOvject = stream;
    });
});