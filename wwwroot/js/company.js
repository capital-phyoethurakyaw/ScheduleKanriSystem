const _service = new Service();
const _urlGetMember = '/api/member/getmember';
const _urlMemberProcess = '/api/member/memberprocess';
const _urlMemberDelete = '/api/member/memberdelete';

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
    $('#dt-search-0').val('');
    $('#dt-search-0').attr('autocomplete', 'off');

    if (localStorage.getItem(`${_service.getTanentID()}_UserRole`) == "admin") { 
        $("#divList").removeAttr('style'); 
    }
}

const action = () => {
    $('#btnBack').on('click', goBack);
    $('#btnSave').on('click', saveMember);
    $('#btnDelete').on('click', deleteMember);
    $('#imgProfile').on('click', imgProfileClick);
    $('#fileInput').on('change', profileImageChange);
    $('#checkAll').on('change', checkAllChange);
    $('#tblMember').off('click', '.table-edit').on('click', '.table-edit', (event) => loadMember('Edit', event));
  

}
const checkAllChange = () => { 
    const isChecked =  $('#checkAll').prop('checked') ;
    $('.row-checkbox').prop('checked', isChecked); 
};
const exportExcel = () => {
    let table = document.getElementById('tblMember');

    let data = [];
    let validColumns = [];

    let headers = [];
    let headerRow = table.querySelectorAll('thead tr th');
    headerRow.forEach((th, colIndex) => {
        let headerText = th.innerText.trim();
        if (headerText) {
            headers.push(headerText);
            validColumns.push(colIndex);
        }
    });
    if (headers.length > 0) {
        data.push(headers);
    }

    let rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        let checkbox = row.querySelector('td:first-child input[type="checkbox"]');
        if (checkbox && checkbox.checked) { // Check if the first column checkbox is checked
            let rowData = [];
            let cells = row.querySelectorAll('td');
            validColumns.forEach(colIndex => {
                rowData.push(cells[colIndex]?.innerText.trim() || "");
            });
            data.push(rowData);
        }
    });


    let worksheet = XLSX.utils.aoa_to_sheet(data);
    let workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "UserList");
    XLSX.writeFile(workbook, ("UserList_" + _service.getTanentID() + "_" + _service.formatteddate(new Date())).replace(' ', '') + ".xlsx");
}

//const exportExcel = () => {
//    let table = document.getElementById('tblMember');
     
//    let data = [];
//    let validColumns = [];  
     
//    let headers = [];
//    let headerRow = table.querySelectorAll('thead tr th');
//    headerRow.forEach((th, colIndex) => {
//        let headerText = th.innerText.trim();
//        if (headerText) {
//            headers.push(headerText);  
//            validColumns.push(colIndex);  
//        }
//    }); 
//    if (headers.length > 0) {
//        data.push(headers);
//    }
     
//    let rows = table.querySelectorAll('tbody tr');
//    rows.forEach(row => {
//        let rowData = [];
//        let cells = row.querySelectorAll('td');
//        validColumns.forEach(colIndex => {
//            rowData.push(cells[colIndex]?.innerText.trim() || "");  
//        });
//        data.push(rowData);
//    });

     
//    let worksheet = XLSX.utils.aoa_to_sheet(data);  
//    let workbook = XLSX.utils.book_new();
//    XLSX.utils.book_append_sheet(workbook, worksheet, "UserList");
//    XLSX.writeFile(workbook, ("UserList_" + _service.getTanentID() + "_" + _service.formatteddate(new Date())).replace(' ','') + ".xlsx");
     
//}
const goBack = () => {
    $('#divEntry').hide();
    $('#divList').show();

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
            render: (data, type, row, meta) => {
                const id = `checkbox_${meta.row + 1}`;  
                return `<input style="width="50px" class="form-check-input row-checkbox" type="checkbox" value="" id="${id}">`;
            }
        },
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
                }
                
            }
        },
        { "data": "Position", className: "text-center align-middle" },
        { "data": "UserRole", className: "text-center align-middle" },
        {
            "data": "CreatedDate", className: "text-center align-middle",
            render: (data, type) => {
                if (!data) return '';
                if (type === 'display' || type === 'filter') {
                    return _service.formatteddate(data);
                }
                return data;
            }
        },
        {
            "data": null, className: "text-center v-center",
            render: () => {
                return `<button class=""><i class="table-icon bi bi-chevron-right table-edit"></i></button>`
            }
        }
    ];

    _service.bindtable($('#tblMember'), { buttons: [], columns: _columns, url: _urlGetMember, model: _model })
        .then(r1 => {
            tblMember = r1;

            $('#tblMember_wrapper .dt-buttons').append(
                `
                <button id="btnNewMember" class="btn btn-info mb10 mr5">New Member</button>

                <button id="btnExport1" class="btn btn-success mb10 ml10"> <i class="bi bi-box-arrow-right"></i> Export</button>
                `
            ); 
            $('#btnNewMember').off('click').on('click', () => loadMember('New'));
            $('#btnExport1').on('click', exportExcel);
            
        });
    $('#dt-search-0').attr('autocomplete', 'off');;
}

const loadMember = (mode, event) => {
    $('#hfMode').val(mode);

    _service.clearmodel({ fields: _membermodel });
    $('#rdoAdmin').prop('checked', true);
    $('#fileInput').val('');

    let row;
    if (event) {
        row = tblMember.row($(event.target).closest('tr')).data();
        row.CreatedDate = _service.formatteddate(row.CreatedDate);
        _service.setmodel({ fields: _membermodel, data: row });
        $('#imgProfile').attr('src', `/images/profile/${row.ProfileImage}`);
    }

    switch (mode) {
        case 'New':
            $('#lblTitle').text('Member Registration');
            break;
        case 'Edit':
            $('#lblTitle').text('Member Edit');
            break;
    }

    $('#divEntry').show();
    $('#divList').hide();
}

const saveMember = (event) => {
    if (!memberErrorCheck()) {
        return;
    }
    event.preventDefault();

    const email = $('#txtEmail').val();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(email)) {
        _service.loadtoast('error', 'Email is invalid!');
        return;
    }

    const phne = $('#txtMobileNo').val();
    const phonePattern = /^\+?[0-9\s\-().]{7,15}$/;
    if (!phonePattern.test(phne)) {
        _service.loadtoast('error', 'PhoneNumber is invalid!');
        return;
    } 
    const file = $('#fileInput')[0].files[0];
    const formData = new FormData();
    formData.append('file', file); 

    const _tenantID = _service.getTanentID();

    const _model = _service.getmodel({ fields: _membermodel });
    _model["Mode"] = $('#hfMode').val();
    _model["TenantID"] = _tenantID;
    _model["CreatedBy"] = localStorage.getItem(`${_tenantID}_userID`);

    for (const key in _model) {
        if (_model.hasOwnProperty(key)) {
            formData.append(key, _model[key]);
        }
    }

    _service.uploadapicall(_urlMemberProcess, formData).then(response => {
        if (response.status == 200) {
            if (localStorage.getItem(`${_tenantID}_userID`) == $ ('#txtUserID').val()) {
                _service.confirmmessage('Your current information have saved successfully and need to login again!').then(() => {
                    location.href = `/${_tenantID}/Member/MemberLogin`;  
                });
            }
            else
            _service.loadtoast('success', `Saved Successfully!`);
           
            goBack();
        }
    });
}

const memberErrorCheck = () => {
    if (!_service.nullcheck({ fields: _membermodel })) return false;

    return true;
}

const deleteMember = () => {
    _service.confirmmessage('Are you sure you want to delete this member?').then(() => {

        const _tenantID = _service.getTanentID();

        const _model = {
            Mode: 'Delete',
            TenantID: _tenantID,
            UserID : $('#txtUserID').val(),
        };

        _service.apicall(_urlMemberDelete, _model).then(response => {
            if (response.status == 200) {
                _service.loadtoast('success', `Deleted Successfully!`);
                
                goBack();
            }
        });
    });
}

const imgProfileClick = () => {
    $('#fileInput').val('');
    $('#fileInput')[0].click();
}

const profileImageChange = () => {
    const file = $('#fileInput')[0].files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            $('#imgProfile').attr('src', e.target.result); 
        };

        reader.readAsDataURL(file);
    }
}