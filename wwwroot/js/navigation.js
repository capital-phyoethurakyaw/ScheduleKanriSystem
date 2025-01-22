

$(() => { 
    navaction();
});
 
const navaction = () => {
    if (localStorage.getItem(`${new Service().getTanentID()}_UserRole`) == "admin") {
        //$('#navUserList').attr('style', 'display: none;');
        //$('#navCompanyList').attr('style', 'display: none;');
        $("#navUserList").removeAttr("style");
        $("#navCompanyList").removeAttr("style");

    }
    $('#navDutyTable').on('click', () => goToNav('DutyPlan/DutyPlanTable'));
    $('#navUserList').on('click', () => goToNav('Member/MemberList'));

    $('.nav-toggle').off('click').on('click', () => toggleSidebar());

    //$('.gg-menu-right').on('click', () => goToWrapperRight());
    //$('.gg-menu-left').on('click', () => goToWrapperLeft()); 
    //$('.gg-more-vertical-alt').on('click', () => goToWrapperTopbar()); 
}

const goToNav = (url) => {
    const _tenantID = new Service().getTanentID();
    location.href = `/${_tenantID}/${url}`;
}

const toggleSidebar = () => {
    if ($('#sliderWrapper').hasClass('sidebar_minimize')) {
        $('#sliderWrapper').removeClass('sidebar_minimize');
    }
    else {
        $('#sliderWrapper').addClass('sidebar_minimize');
    } 

    if ($('html[lang="en"]').hasClass('nav_open')) {
        $('html[lang="en"]').removeClass('nav_open');
    }
    else {
        $('html[lang="en"]').addClass('nav_open');
    }
}

//const goToWrapperRight = () => { 
   
//    if ($('#sliderWrapper').hasClass('sidebar_minimize')) {
//        $('#sliderWrapper').removeClass('sidebar_minimize');
//    }
//    else {
//        $('#sliderWrapper').addClass('sidebar_minimize'); 
//    } 
//}
//const goToWrapperLeft = () => {
//    if ($('html[lang="en"]').hasClass('nav_open')) {
//        $('html[lang="en"]').removeClass('nav_open');
//    }
//    else {
//        $('html[lang="en"]').addClass('nav_open');
//    }
//}
//const goToWrapperTopbar = () => {
//    if ($('html[lang="en"]').hasClass('topbar_open')) {
//        $('html[lang="en"]').removeClass('topbar_open');
//    }
//    else {
//        $('html[lang="en"]').addClass('topbar_open');
//    }
//}
