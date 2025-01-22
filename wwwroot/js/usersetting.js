$(() => {
    usersettingconfig();
});

const usersettingconfig = () => {
    const _tenantID = new Service().getTanentID();
    const _userName = localStorage.getItem(`${_tenantID}_userName`);
    const _profilephoto = localStorage.getItem(`${_tenantID}_ProfilePhoto`);
    const _userRole = localStorage.getItem(`${_tenantID}_UserRole`);
    const _currentDatetime = new Date().toISOString();

    $('.lblUserName').html('<span style="color:white;font-size: 15px;text-transform: capitalize;">' + _userName +'</span> <br><span style="font-size: 10px;color:#01bfff;text-transform: capitalize;">' + _userRole +'</span>'); 
    $('.imgmyprofile').attr('src', `/images/profile/${_profilephoto}?v=${_currentDatetime}`);

    $('#btnLogout').on('click', () => {

        localStorage.removeItem(`${_tenantID}_jwtToken`);
        localStorage.removeItem(`${_tenantID}_userID`);
        localStorage.removeItem(`${_tenantID}_userName`);
        localStorage.removeItem(`${_tenantID}_ProfilePhoto`);
        localStorage.removeItem(`${_tenantID}_UserRole`);

        location.href = `/${_tenantID}/Member/MemberLogin`;  //+"/Member/MemberLogin";// "http://localhost:5263/0/Member/MemberLogin" ; //"http://localhost:5263/0/Tenant/HomePage"
    });
}
function getFirstSectionAfterDomain(url) {

    const urlObj = new URL(url);

    const path = urlObj.pathname;

    const firstPart = path.split('/').filter(part => part)[0];

    return firstPart || null;
}