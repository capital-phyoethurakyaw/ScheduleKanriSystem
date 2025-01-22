const _service = new Service();
const _urlTenantCheck = '/api/tenant/tenantcheck';

$(() => {
    config();
    action();
});

const config = () => {

}

const action = () => {
    $('#btnTenantLogin').on('click', tenantLogin);
}

const tenantLogin = () => {

    if (_service.isnullorempty($('#txtTenantID').val())) {
        _service.loadtoast('error', 'Tenant ID is required!');
        return;
    }

    const _model = {
        TenantID: $('#txtTenantID').val(),
    };

    axios.post(_urlTenantCheck, _model).then(response => {
        location.href = `/${$('#txtTenantID').val() }/Member/MemberLogin`;
    }).catch(error => {
        _service.loadtoast('error', error.response.data.data.message);
    });
}