class Service {
    nullcheck = (setting) => {
        const _fields = setting.fields;
        return _fields.every((item) => {
            const _element = $(item.selector);
            const _value = _element.val()?.trim();

            // Check if element is visible, required, and either undefined, null, or empty
            if (_element.is(':visible') && item.required && (!_value || _value === "")) {
                _service.loadtoast('error', `${item.name} is required!`);
                _element[0].focus();
                return false; // Stop iteration (invalid case)
            }
            return true; // Continue iteration (valid case)
        });
    }

    getmodel = (setting) => {
        const _fields = setting.fields;
        const obj = {};
        _fields.forEach(field => {
            if (field.model !== "") {
                if (field.isradio) {
                    obj[field.model] = $(`input[name="${field.selector}"]:checked`).val();
                } else {
                    obj[field.model] = $(field.selector).val();
                }
            }
        });
        return obj;
    }

    setmodel = (setting) => {
        const _fields = setting.fields;
        _fields.forEach(field => {
            var value = setting.data[field.model];
            if (field.isdate === true) {
                $(field.selector).datepicker('setDate', new Date(value));
            } else if (field.isradio) {
                if (value === false) value = "0";
                else if (value === true) value = "1";
                $(`input[name="${field.selector}"][value="${value}"]`).prop('checked', true);
            } else {
                if (field.ismoney === true) {
                    if (field.isabsolute === true) {
                        value = Math.abs(value)
                    }

                    value = Number(value).toLocaleString(); // Format the number with commas
                }

                $(field.selector).val(value);
            }
        });
    }

    clearmodel = (setting) => {
        setting.fields.forEach(field => {
            const $element = $(field.selector);

            if (field.isdate === true) {
                this.cleardate($element);
            } else if ($element.is('input[type="text"],input[type="password"], input[type="hidden"], textarea')) {
                $element.val('');
            } else if ($element.is('select')) {
                this.ddldefault($element);  // Ensure this refers to the correct object
            }
        });
    }

    ddldefault = (selector) => {
        $(selector).val($(selector).find("option:first").val());
    }

    loadtoast = (icon, message) => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'center',
            iconColor: 'white',
            customClass: {
                popup: 'colored-toast',
            },
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
        })

        Toast.fire({
            icon: icon,
            title: message,
        })
    }

    confirmmessage(message) {
        return new Promise((resolve, reject) => {

            $('#confirmtext').html(message);
            $('#confirmmodal').modal('show');

            // Handle confirmation button click
            $('#confrimok').off('click').on('click', function () {
                $('#confirmmodal').modal('hide');
                resolve();
            });
        });
    }

    isnullorempty = (value) => {
        return value === null || value === undefined || (typeof value === 'string' && value.trim() === "");
    }

    apicall = (url, model) => {
        const _tenantID = this.getTanentID();
        const _token = localStorage.getItem(`${_tenantID}_jwtToken`);

        if (this.isnullorempty(_token)) {
            console.error('Token is null or empty, redirecting to login.');

            location.href = `/0/Tenant/HomePage`;
            return;
        }

        return axios.post(url, model, {
            headers: {
                'Authorization': `Bearer ${_token}` // Include the token in the Authorization header
            }
        }).catch(error => {
            if (error.response && error.response.status === 401) {
                console.log("Unauthorized: Token might be expired");
                location.href = `/0/Tenant/HomePage`;
            } else {
                console.error('API call error:', error.response);
            }
        });
    }

    uploadapicall = (url, formdata) => {
        const _tenantID = this.getTanentID();
        const _token = localStorage.getItem(`${_tenantID}_jwtToken`);

        if (this.isnullorempty(_token)) {
            console.error('Token is null or empty, redirecting to login.');

            location.href = `/0/Tenant/HomePage`;
            return;
        }

        return axios.post(url, formdata, {
            headers: {
                'Authorization': `Bearer ${_token}`, // Token authentication
                'Content-Type': 'multipart/form-data' // Required for file uploads
            }
        }).catch(error => {
            if (error.response) {
                console.error('Error uploading file:', error.response.data);
            } else {
                console.error('Error:', error);
            }
        });
    }

    bindtable = (table, config) => {
        this.showtableloading(table);
        return this.apicall(config.url, config.model)
            .then((response) => {
                this.hidetableloading(table);
                let t1 = table.DataTable($.extend({
                    language: {
                        info: "Total: _TOTAL_ records",
                        infoFiltered: "(filtered from _MAX_ total records)",
                        lengthMenu: "Show _MENU_"
                    },
                    dom:
                        "<'row'<'col-sm-12 col-md-4 d-flex tbldivleft align-items-center justify-content-start custom-text'ilf><'col-sm-12 col-md-8 d-flex align-items-center justify-content-end'B>>" +
                        "<'row'<'col-sm-12'tr>>" +
                        "<'row'<'col-sm-12 col-md-6'><'col-sm-12 col-md-6 divpaging'p>>",
                    responsive: true,
                    data:  response.data.data,
                    destroy: true,
                    ordering: false,
                }, config));

                return t1;
            });
    }

    showtableloading = (table) => {
        const tbl = table.attr('id')

        if ($.fn.DataTable.isDataTable(tbl)) {
            $(tbl).DataTable().clear().destroy();
        }

        // Clear any existing content in the table body
        $(tbl).find('tbody').remove();

        // Create the loading indicator HTML
        const spinnerHtml = `
            <div class="loading-icon">
                <i class="bi bi-cloud-arrow-down-fill"></i>
                <i class="bi bi-cloud-arrow-down-fill"></i>
                <i class="bi bi-cloud-arrow-down-fill"></i>
            </div>
        `;

        // Append the loading indicator to the table
        const loadingRowHtml = `<tbody><tr><td class="text-center" colspan="100">${spinnerHtml}</td></tr></tbody>`;
        table.append(loadingRowHtml);
    }

    hidetableloading = (table) => {
        const tbl = table.attr('id')
        $('#' + tbl + ' tbody').empty();
    }

    getTanentID = () => {
        let path = window.location.pathname;
        let parts = path.split('/');
        let tenantID = parts[1];

        return tenantID;
    }

    formatteddate = (value) => {
        var date = new Date(value);
        var formattedDate = moment(value).format('YYYY-MM-DD HH:mm:ss');
        return formattedDate;
    }

    getCurrentMonth = () => {
        return String(new Date().getMonth() + 1).padStart(2, '0');
    }
}