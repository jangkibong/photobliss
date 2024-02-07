$(function(){
    const shoot_type_choose = $("button.photo_sample");
    const shoot_type_box = $(".type_item")
    const btn_logo = $(".logo > a")

    let shoot_type = window.localStorage.getItem("shoot type");// basic , wide
    let cut_count = window.localStorage.getItem("cut count");// 4,3,2,6
    let select_cut = $("." + shoot_type).find($('button.photo_sample[data-cut="'+ cut_count + '"]'));
    
    shoot_type_choose.on('click', function(){
        shoot_type_box.removeClass('on');
        $(this).parents(".type_item").addClass('on');
        
        window.localStorage.setItem("shoot type", $(this).attr('data-shoot-type'));
        window.localStorage.setItem("cut count", $(this).attr('data-cut'));
        
        shoot_type = window.localStorage.getItem("shoot type");
        cut_count = window.localStorage.getItem("cut count");
        select_cut = $("." + shoot_type).find($('button.photo_sample[data-cut="'+ cut_count + '"]'));
    });

    select_cut.trigger('click')
    btn_logo.on('click', function(){
        window.localStorage.setItem("shoot type", "basic");
        window.localStorage.setItem("cut count", "4");
    });
});