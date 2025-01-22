const _service = new Service();

const _urlGetDutyPlan = '/api/dutyplan/getdutyplan';
const _urlDutyProcess = '/api/dutyplan/dutyplanprocess';

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth() + 1;

var tblDuty;

$(() => {
    config();
    action();
});

const config = () => {
    setYearMonth();  
}

const action = () => {
    $('#btnPrev').on('click', () => setYearMonth('prev'));
    $('#btnNext').on('click', () => setYearMonth('next'));
    loadMemberCount();
}

const setYearMonth = (type) => {
    switch (type) {
        case "prev":
            currentMonth--;
            if (currentMonth < 1) {
                currentMonth = 12;
                currentYear--;
            }
            break;
        case "next":
            currentMonth++;
            if (currentMonth > 12) {
                currentMonth = 1;
                currentYear++;
            }
            break;

        default:
            currentYear = new Date().getFullYear();
            currentMonth = new Date().getMonth() + 1;
            break;
    }

    $('.lblYear').text(currentYear);
    $('.lblMonth').text(String(currentMonth).padStart(2, '0')).val(String(currentMonth).padStart(2, '0'));

    $('#tblDuty').empty();

    $('#tblDuty').append('<thead></thead>');
    $('#tblDuty').append('<tbody></tbody>');

    loadTableHeader(); 
    loadTableBody();
   

}
const loadMemberCount = (val) => {
    $('.lblMemberCount').html("<span style='color:black;text-transform: capitalize;'>Member : </span> <span style='color:#01bfff;'>" + val + "</span>");
};

const loadTableHeader = () => {
    const _totalDays = new Date(currentYear, currentMonth, 0).getDate();

    let headerRow1 = '<tr><th rowspan="3" class="lblMemberCount">Member : 10</th>';
    for (let i = 1; i <= _totalDays; i++) {
        const date = new Date(currentYear, currentMonth - 1, i);
        const dayOfWeek = date.getDay();
        const dayTextJapanese = ['日', '月', '火', '水', '木', '金', '土'][dayOfWeek];
        headerRow1 += `<th>${dayTextJapanese}</th>`;
    }
    headerRow1 += '</tr>';

    let headerRow2 = '<tr>';
    for (let i = 1; i <= _totalDays; i++) {
        headerRow2 += `<th>${i}</th>`;
    }
    headerRow2 += '</tr>';

    let headerRow3 = '<tr>';
    for (let i = 1; i <= _totalDays; i++) {
        headerRow3 += `<th class="d${i}_totalMember">0</th>`;
    }
    headerRow3 += '</tr>';

    $('#tblDuty thead').append(headerRow1 + headerRow2 + headerRow3);
}

const loadTableBody = () => {
    const _model = {
        TenantID: _service.getTanentID(),
        YYYY: `${currentYear}`,
        MM: `${currentMonth}`,
    }

    _service.apicall(_urlGetDutyPlan, _model).then(response => {
        const _data = response.data.data;
        const _distinctData = [...new Set(_data.map(item => item.UserID))]
            .map(userID => {
                return _data.find(item => item.UserID === userID);
            })
            .sort((a, b) => a.UserName.localeCompare(b.UserName));

        _distinctData.forEach(distinctuser => {
            let bodyRow = `<tr id="tr-${distinctuser.UserID}"><td>
                            <div class="td-userinfo">
                                <input type="hidden" value="${distinctuser.UserID}">
                                <img src="/images/profile/${distinctuser.ProfileImage}" />
                               <div><span style="text-transform: capitalize;"> ${distinctuser.UserName} </span>  <br> <span style="color:#01bfff; font-size:10px;"> ${distinctuser.UserRole== 'admin'?  'Admin' : ''} </span></div>
                                <button onclick="showCalendar(this)" data-uid="${distinctuser.UserID}" class="btnCalendar btn btn-sm show-hide-attr"><i class="bi bi-calendar3"></i></button>
                            </div></td>`;

            const _filteredData = _data.filter(item => item.UserID === distinctuser.UserID);
            const _totalDays = new Date(currentYear, currentMonth, 0).getDate(); 

            for (let i = 1; i <= _totalDays; i++) {
                const hasDuty = _filteredData.some(user => user.DutyDay === i); // check if user has duty on that day

                let td = `<td class="td-d${i}"></td>`;
                if (hasDuty) {
                    td = `<td class="td-d${i}"><div class="duty duty-d${i}"></div></td>`;
                }

                bodyRow += td;
            }

            bodyRow += '</tr>';

            $('#tblDuty tbody').append(bodyRow);
        });
        loadMemberCount(_distinctData.length);
        calcTotalMember();
    });
 
   
}

const showCalendar = (button) => {

    if (localStorage.getItem(`${_service.getTanentID()}_UserRole`) == "user") {
        return;
    }

    const _userID = $(button).data('uid');
    let dutyDates = [];
    const _tenantID = _service.getTanentID();

    const _model = {
        TenantID: _tenantID,
        YYYY: `${currentYear}`,
        MM: `${currentMonth}`,
        UserID: _userID,
    }

    _service.apicall(_urlGetDutyPlan, _model).then(response => {
        const _data = response.data.data;

        _data.forEach(user => {
            if (!_service.isnullorempty(user.DutyDay)) {
                dutyDates.push(`${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(user.DutyDay).padStart(2, '0')}`);
            }
        });

        const startOfMonth = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
        const endOfMonth = new Date(currentYear, currentMonth, 0); // Last day of the current month
        const formattedEndOfMonth = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(endOfMonth.getDate()).padStart(2, '0')}`;

        const flatpickrInstance = flatpickr(button, {
            mode: "multiple",
            dateFormat: "Y-m-d",
            defaultDate: dutyDates,
            minDate: startOfMonth, 
            maxDate: formattedEndOfMonth,
            onChange: (selectedDates, dateStr, instance) => {
                const clickedDate = instance.formatDate(instance.latestSelectedDateObj, "Y-m-d");

                let mode;
                if (dutyDates.includes(clickedDate)) {
                    mode = 'Delete';
                } else {
                    mode = 'New'
                }

                const _model1 = {
                    Mode: mode,
                    TenantID: _tenantID,
                    DutyDate: clickedDate,
                    UserID: _userID,
                    CreatedBy: localStorage.getItem(`${_tenantID}_userID`)
                }
                _service.apicall(_urlDutyProcess, _model1).then(response => {
                    if (response.status === 200) {

                        const _day = instance.latestSelectedDateObj.getDate();
                        if (mode === 'Delete') {
                            dutyDates = dutyDates.filter(date => date !== clickedDate); // Remove the date

                            $(`#tr-${_userID} .td-d${_day}`).empty();

                        } else {
                            dutyDates.push(clickedDate); // Add the date

                            $(`#tr-${_userID} .td-d${_day}`).append(`<div class="duty duty-d${_day}"></div>`);
                        }
                        calcTotalMember();
                        
                    } else {
                        _service.loadtoast('error', 'saved failed!');
                    }
                });
            },
            onReady: (selectedDates, dateStr, instance) => {
                const calendarContainer = instance.calendarContainer;
                const closeButton = document.createElement("button");
                closeButton.textContent = "Close";
                closeButton.className = "btn btn-secondary flatpickr-close-btn";
                closeButton.style.margin = "10px";
                closeButton.onclick = () => {
                    instance.close();
                    $('.flatpickr-calendar').hide();
                };
                calendarContainer.appendChild(closeButton);

                $('.flatpickr-calendar').show();//to prevent showing twice
            },
        });

        // Open Flatpickr programmatically
        flatpickrInstance.open();

        // Handle click outside to destroy the Flatpickr instance
        $(document).off('click.flatpickr').on('click.flatpickr', function (e) {
            if (!$(e.target).closest(button).length && !$(e.target).hasClass('flatpickr-calendar')) {
                flatpickrInstance.close();
                $(document).off('click.flatpickr');

                $('.flatpickr-calendar').hide();//to prevent showing twice
            }
        });
    });
};

const calcTotalMember = () => {
    const _totalDays = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = 1; i <= _totalDays; i++) {
        const _total = $(`.duty-d${i}`).length;
        $(`.d${i}_totalMember`).text(_total);
    }
}


