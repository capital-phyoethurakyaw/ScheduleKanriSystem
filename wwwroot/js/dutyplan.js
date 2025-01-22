const _service = new Service();
const _urlgetdaysofMonth = '/api/dutyplan/getdaysofMonth';

var tblMember;

const _membermodel = [
    { selector: '#txtUserID', name: "User ID", model: "UserID" },
    { selector: '#txtRegisterDate', model: "CreatedDate" },
    { selector: '#txtName', name: "User Name", required: true, model: "UserName" },
    { selector: '#txtEmail', name: "Email", required: true, model: "Email" },
    { selector: '#ddlPosition', name: "Position", required: true, model: "Position" },
    { selector: '#txtPassword', name: "Password", required: true, model: "Password" },
    { selector: 'rdoUserRole', isradio : true, model: "UserRole" },
    { selector: '#txtMobileNo', name: "Mobile No", required: true, model: "MobileNumber" },
];

$(() => {
    config();
    action();
});

const config = () => {
    loadMemberList();
}

const action = () => {
    //$('#btnNewMember').on('click', () => loadMember('New'));
    //$('#btnBack').on('click', goBack);
    //$('#btnSave').on('click', saveMember);
    //$('#btnDelete').on('click', deleteMember);
    //$('#imgProfile').on('click', imgProfileClick);
    //$('#fileInput').on('change', profileImageChange);
    //$('#tblMember').off('click', '.table-edit').on('click', '.table-edit', (event) => loadMember('Edit', event));
}

const goBack = () => {
    //$('#divEntry').hide();
    //$('#divList').show();

    loadMemberList();
}

const loadMemberList = () => {
    const _model = {
        TenantID: _service.getTanentID(),
    };

    const _columns = [
        {
            "data": null,
            className: "text-center align-middle",
            render: (data, type, row) => {
                return `<span>${row.UserID}</span><br><span>${row.UserName}</span>`;
            }
        },
        {
            "data": "ProfileImage",
            className: "text-center align-middle",
            render: (data, type, row) => {
                const currentDatetime = new Date().toISOString();
                if (data) {
                    return `<image class="imgcircle" src="/images/profile/${row.ProfileImage}?v=${currentDatetime}" />`
                } else {
                    return `<image class="imgcircle" src="/images/profile/default.png" />`
                }             }
        },
        { "data": "Position", className: "align-middle" },
        { "data": "UserRole", className: "align-middle" },
        { "data": "CreatedDate", className: "text-right align-middle" },
        {
            "data": null, className: "text-center v-center",
            render: () => {
                return `<i class="table-icon bi bi-pencil-square table-edit"></i>`
            }
        }
    ];
  
    _service.bindtable($('#tblMember'), { buttons: [], columns: [], url: _urlgetdaysofMonth, model: _model })
        .then(r1 => {
            tblMember = r1;
        });
}
  

const memberErrorCheck = () => {
    if (!_service.nullcheck({ fields: _membermodel })) return false;

    return true;
}
 

 

 