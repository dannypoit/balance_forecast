'use strict';

document.addEventListener('turbolinks:load', function () {
  // const userId = $('#currentBalance').data('user-id');
  const userId = document.querySelector('#currentBalance').dataset.userId;

  const currentBalance = document.getElementById('currentBalance').innerText;
  let newBalance = parseFloat(currentBalance.replace('$', '').replace(',', ''));
  const $saveIcon = $('#currentBalSaveIcon');

  // get time zone offset for user from data attribute on currentBalance and store in const
  const timeZoneOffset = document.getElementById('currentBalance').dataset
    .timeZoneOffset;

  // build whole time zone string to add onto date from Rails before converting back to JS date
  let timeZoneOffsetStr = String(timeZoneOffset);

  if (timeZoneOffset > -10 && timeZoneOffset < 0) {
    timeZoneOffsetStr = `T00:00:00.000${timeZoneOffsetStr.replace(
      '-',
      '-0'
    )}:00`;
  } else if (timeZoneOffset > 0 && timeZoneOffset < 10) {
    timeZoneOffsetStr = `T00:00:00.000+0${timeZoneOffsetStr}:00`;
  } else if (timeZoneOffset <= -10) {
    timeZoneOffsetStr = `T00:00:00.000${timeZoneOffsetStr}:00`;
  } else if (timeZoneOffset >= 10) {
    timeZoneOffsetStr = `T00:00:00.000+${timeZoneOffsetStr}:00`;
  } else {
    timeZoneOffsetStr = '';
  }

  // update current balance
  $('#currentBalanceCell').on('click', '[data-current-balance]', function () {
    const floatBal = parseFloat(
      currentBalance.replace('$', '').replace(',', '')
    );
    let $input = $('<input type="number" step=".01"/>').val(floatBal);
    const $currentBalanceCell = $(this);
    $(this).replaceWith($input.select());
    $saveIcon.toggleClass('d-none');

    const save = function () {
      const enteredBalance = $input.val();
      const $span = $('<span data-current-balance id="currentBalance" />').text(
        enteredBalance
      );
      $input.replaceWith($span);

      const updatedBalance = document.getElementById('currentBalance')
        .innerHTML;

      $.post('/users/' + userId, {
        _method: 'PUT',
        user: {
          current_balance: updatedBalance,
          success: setTimeout(
            window.location.reload.bind(window.location),
            200
          ),
        },
      });
    };

    $saveIcon.on('mousedown', function () {
      save();
    });

    $input
      .keyup(function (event) {
        if (event.keyCode == 13) {
          save();
        } else if (event.keyCode == 27) {
          $(this).replaceWith($currentBalanceCell);
          $saveIcon.toggleClass('d-none');
        }
      })
      .on('blur', function () {
        $(this).replaceWith($currentBalanceCell);
        $saveIcon.toggleClass('d-none');
      })
      .focus();
  });

  // convert JavaScript date to string in YYYY-MM-DD format
  const convertDateJsToStrDashes = function (jsDate) {
    let d = new Date(jsDate),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  // convert JavaScript date to string in MM/DD/YYYY format
  const convertDateJsToStrSlashes = function (jsDate) {
    let d = new Date(jsDate),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [month, day, year].join('/');
  };

  // create new table row for each entry
  function createEntryRow(entry) {
    const entryAmount = parseFloat(entry.amount);
    newBalance += entryAmount;
    let entryColorClass = '';
    let entryActionsClass = '';
    let entryIsEarliestClass = '';

    // note: does not need timeZoneOffsetStr added, because it is creating a new JS date, which comes in at the correct time zone
    const currentDate = convertDateJsToStrSlashes(new Date());

    // get date from Rails, add timeZoneOffsetStr, convert to JS date, and store in const
    const entryDateSlashes = convertDateJsToStrSlashes(
      new Date(entry.date + timeZoneOffsetStr)
    );

    // timeZoneOffsetStr added to each entry.date from Rails before converted to JS date
    if (new Date(entry.date + timeZoneOffsetStr) < new Date(currentDate)) {
      entryColorClass = ' past-date ';
    } else if (
      entry.amount > 0 &&
      new Date(entry.date + timeZoneOffsetStr) >= new Date(currentDate)
    ) {
      entryColorClass = ' credit ';
    } else if (
      newBalance < 0 &&
      new Date(entry.date + timeZoneOffsetStr) >= new Date(currentDate)
    ) {
      entryColorClass = ' in-the-red ';
    }
    if (entry.isEarliest === true) {
      entryIsEarliestClass = 'class="earliest"';
    } else {
      entryActionsClass = ' d-none';
    }

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    // note: entry.date should not need timeZoneOffsetStr added here, because it is not being converted to JS date; it is just displayed as a string
    // note: do NOT leave space or line breaks between span tags
    const entryRow = `
      <tr class="entry-row ${entryColorClass}">
        <td class="date-col">
          <span 
            ${entryIsEarliestClass} 
            data-date 
            data-id="${entry.id}">${entryDateSlashes}</span>
          <i 
            data-id="${entry.id}" 
            id="dateSaveIcon" 
            class="fas fa-save m-2 d-none">
          </i>
        </td>
        <td>
          <span 
            ${entryIsEarliestClass} 
            data-description 
            data-id="${entry.id}">${entry.description}</span>
          <i 
            data-id="${entry.id}" 
            id="descSaveIcon" 
            class="fas fa-save m-2 d-none">
          </i>
        </td>
        <td>
          <span 
            ${entryIsEarliestClass} 
            data-frequency 
            data-id="${entry.id}">${entry.frequency}</span>
          <i 
            data-id="${entry.id}" 
            id="freqSaveIcon" 
            class="fas fa-save m-2 d-none">
          </i>
        </td>
        <td>
          <span 
            ${entryIsEarliestClass} 
            data-amount 
            data-id="${entry.id}" 
            data-amount-date="${entry.date}" 
            data-amount-desc="${entry.description}" 
            data-amount-freq="${entry.frequency}">${formatter.format(
      entryAmount
    )}</span>
          <i 
            data-id="${entry.id}" 
            id="amtSaveIcon" 
            class="fas fa-save m-2 d-none">
          </i>
        </td>
        <td>
          ${formatter.format(newBalance)}
        </td>
        <td class="entry-actions-cell pl-2 ${entryActionsClass}">
          <i 
            class="fas fa-check" 
            data-id="${entry.id}" 
            data-user-id="${entry.user_id}" 
            data-amount-to-clear="${entry.amount}" 
            title="Clear entry">
          </i>
          <i 
            class="far fa-trash-alt ml-2 mr-0" 
            data-id="${entry.id}" 
            title="Delete entry">
          </i>
        </td>
      </tr>
    `;
    return entryRow;
  }

  // get all entries for current user in JSON format
  $.get('/entries').success(function (data) {
    let allEntryRows = '';

    // convert date string in MM/DD/YYYY format to YYYY-MM-DD format for saving in db
    const convertSlashesToDashes = function (dateSlashes) {
      let dateArr = dateSlashes.split('/');
      dateArr.push(dateArr.shift());
      dateArr.push(dateArr.shift());
      return dateArr.join('-');
    };

    // add each entry row to allEntryRows variable
    $.each(data, function (_, entry) {
      allEntryRows += createEntryRow(entry);
    });

    let $entriesTable = $('.entries-table');
    $entriesTable.html(allEntryRows);

    // update date
    $('.entry-row').on('click', '[data-date]', function (e) {
      const entryId = $(e.target).data('id');
      const $dateCell = $(
        'span.earliest[data-date][data-id="' + entryId + '"]'
      );

      // note: there may be an easier way to do the next steps below, but for now it works

      // convert date string pulled from cell from slashes to dashes format
      const entryDateDashesNoTZ = convertSlashesToDashes($dateCell.text());

      // add timeZoneOffsetStr to entry date and convert to JS date
      const entryDateJS = new Date(entryDateDashesNoTZ + timeZoneOffsetStr);

      // convert JS date to date string in dashes format
      const entryDateDashes = convertDateJsToStrDashes(entryDateJS);

      let $input = $('<input type="date" />').val(entryDateDashes);
      $dateCell.replaceWith($input);
      const $saveIcon = $(`#dateSaveIcon[data-id="${entryId}"]`)
        .first()
        .first();
      $saveIcon.toggleClass('d-none');

      const save = function () {
        const $span = $('<span data-date id="updatedDateCell" />').text(
          $input.val()
        );
        $input.replaceWith($span);
        const updatedDate = document.getElementById('updatedDateCell')
          .innerHTML;

        $.post('/entries/' + entryId, {
          _method: 'PUT',
          id: entryId,
          entry: {
            date: updatedDate,
            success: location.reload(),
          },
        });
      };

      $saveIcon.on('mousedown', function () {
        save();
      });

      $input
        .keyup(function (event) {
          if (event.keyCode == 13) {
            save();
          } else if (event.keyCode == 27) {
            $(this).replaceWith($dateCell);
            $saveIcon.toggleClass('d-none');
          }
        })
        .on('blur', function () {
          $(this).replaceWith($dateCell);
          $saveIcon.toggleClass('d-none');
        })
        .focus();
    });

    // update description
    $('.entry-row').on('click', '[data-description]', function (e) {
      const entryId = $(e.target).data('id');
      const $descCell = $(
        'span.earliest[data-description][data-id="' + entryId + '"]'
      );
      let $input = $('<input/>').val($descCell.text());
      $descCell.replaceWith($input);
      const $saveIcon = $(`#descSaveIcon[data-id="${entryId}"]`)
        .first()
        .first();
      $saveIcon.toggleClass('d-none');

      const save = function () {
        const $span = $(
          '<span data-description id="updatedDescriptionCell" />'
        ).text($input.val());
        $input.replaceWith($span);
        const updatedDescription = document.getElementById(
          'updatedDescriptionCell'
        ).innerHTML;

        $.post('/entries/' + entryId, {
          _method: 'PUT',
          id: entryId,
          entry: {
            description: updatedDescription,
            success: location.reload(),
          },
        });
      };

      $saveIcon.on('mousedown', function () {
        save();
      });

      $input
        .keyup(function (event) {
          if (event.keyCode == 13) {
            save();
          } else if (event.keyCode == 27) {
            $(this).replaceWith($descCell);
            $saveIcon.toggleClass('d-none');
          }
        })
        .on('blur', function () {
          $(this).replaceWith($descCell);
          $saveIcon.toggleClass('d-none');
        })
        .focus();
    });

    // update frequency
    $('.entry-row').on('click', '[data-frequency]', function (e) {
      const entryId = $(e.target).data('id');
      const $freqCell = $(
        'span.earliest[data-frequency][data-id="' + entryId + '"]'
      );
      const $select = $(`
        <select id="frequency-select">
          <option value="one-time">One-time</option>
          <option value="weekly">Weekly</option>
          <option value="bi-weekly">Bi-weekly</option>
          <option value="monthly">Monthly</option>
          <option value="bi-monthly">Bi-monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="annually">Annually</option>
        </select>
      `).val($freqCell.text());
      $freqCell.replaceWith($select);
      const $saveIcon = $(`#freqSaveIcon[data-id="${entryId}"]`)
        .first()
        .first();
      $saveIcon.toggleClass('d-none');

      const save = function () {
        const $span = $(
          '<span data-frequency id="updatedFrequencyCell" />'
        ).text($select.val());
        $select.replaceWith($span);
        const updatedFrequency = document.getElementById('updatedFrequencyCell')
          .innerHTML;

        $.post('/entries/' + entryId, {
          _method: 'PUT',
          id: entryId,
          entry: {
            frequency: updatedFrequency,
            success: location.reload(),
          },
        });
      };

      $saveIcon.on('mousedown', function () {
        save();
      });

      $select
        .keyup(function (event) {
          if (event.keyCode == 13) {
            save();
          } else if (event.keyCode == 27) {
            $(this).replaceWith($freqCell);
            $saveIcon.toggleClass('d-none');
          }
        })
        .on('blur', function () {
          $(this).replaceWith($freqCell);
          $saveIcon.toggleClass('d-none');
        })
        .focus();
    });

    // update amount
    $('.entry-row').on('click', '[data-amount]', function (e) {
      const entryId = $(e.target).data('id');
      const entryDate = $(e.target).data('amount-date');
      const entryDesc = $(e.target).data('amount-desc');
      const entryFreq = $(e.target).data('amount-freq');
      const $el = $('span.earliest[data-amount][data-id="' + entryId + '"]');
      const textAmt = $el[0].innerText;
      const decAmt = parseFloat(textAmt.replace('$', '').replace(',', ''));
      let $input = $('<input type="number" step=".01" />').val(decAmt);
      $el.replaceWith($input.select());
      const $saveIcon = $(`#amtSaveIcon[data-id="${entryId}"]`).first().first();
      $saveIcon.toggleClass('d-none');

      const saveOneTime = function () {
        const enteredAmount = $input.val();
        const $span = $('<span id="updatedAmountCell" />').text(enteredAmount);
        $input.replaceWith($span);
        const updatedAmount = $('#updatedAmountCell')[0].innerText;

        $.post('/entries/' + entryId, {
          _method: 'PUT',
          id: entryId,
          entry: {
            amount: updatedAmount,
            success: setTimeout(location.reload(), 200),
          },
        });
      };

      const changeEarliestAmountOnly = function () {
        const enteredAmount = $input.val();
        // need to refactor
        // see notes in changeAllRecurringAmounts
        const $span = $('<span id="updatedAmountCell" />').text(enteredAmount);
        $el.replaceWith($span);

        const updatedAmount = $('#updatedAmountCell')[0].innerText;

        // add timeZoneOffsetStr to entry date pulled from Rails before converting to JS date
        const newRecurringDate = new Date(entryDate + timeZoneOffsetStr);

        if (entryFreq === 'weekly') {
          newRecurringDate.setDate(newRecurringDate.getDate() + 7);
        } else if (entryFreq === 'bi-weekly') {
          newRecurringDate.setDate(newRecurringDate.getDate() + 14);
        } else if (entryFreq === 'monthly') {
          newRecurringDate.setMonth(newRecurringDate.getMonth() + 1);
        } else if (entryFreq === 'bi-monthly') {
          newRecurringDate.setMonth(newRecurringDate.getMonth() + 2);
        } else if (entryFreq === 'quarterly') {
          newRecurringDate.setMonth(newRecurringDate.getMonth() + 3);
        } else if (entryFreq === 'annually') {
          newRecurringDate.setMonth(newRecurringDate.getMonth() + 12);
        }

        const updatedDate = convertDateJsToStrDashes(newRecurringDate);

        // create one-time entry to match earliest
        // note: timeZoneOffsetStr does not need to be added here because it is not being converted to JS date
        $.post('/entries/', {
          entry: {
            date: entryDate,
            description: entryDesc,
            frequency: 'one-time',
            amount: updatedAmount,
          },
        });

        // change date on recurring series to next recurrence
        $.post('/entries/' + entryId, {
          _method: 'PUT',
          id: entryId,
          entry: {
            date: updatedDate,
            success: setTimeout(location.reload(), 200),
          },
        });
      };

      const changeAllRecurringAmounts = function () {
        const enteredAmount = $input.val();
        // need to refactor
        // currently it is done this way to mark the cell as updated, so the updatedAmount can be pulled from it
        // but the cell doesn't need to be replaced, since it gets reloaded right afterwards anyways
        // so there must be a better way to do this without updating the span
        // also this is repeated in changeEarliestAmountOnly
        const $span = $('<span id="updatedAmountCell" />').text(enteredAmount);
        $el.replaceWith($span);
        const updatedAmount = $('#updatedAmountCell')[0].innerText;

        $.post('/entries/' + entryId, {
          _method: 'PUT',
          id: entryId,
          entry: {
            amount: updatedAmount,
            success: setTimeout(location.reload(), 200),
          },
        });
      };

      const promptForRecurring = function () {
        bootbox.dialog({
          message:
            '<p>Do you want to change the earliest entry only or all entries?</p><p class="text-muted small">This is a recurring series.</p><p class="text-muted small">If you select <strong>Earliest Entry Only</strong>, that entry will be converted to one-time with the updated amount, and all subsequent entries will remain with the previous amount.</p><p class="text-muted small">If you select <strong>All Entries</strong>, all entries in the series will be updated with the new amount.</p>',
          centerVertical: true,
          buttons: {
            earliest: {
              label: 'Earliest Entry Only',
              className: 'btn-primary',
              callback: function () {
                changeEarliestAmountOnly();
              },
            },
            all: {
              label: 'All Entries',
              className: 'btn-success',
              callback: function () {
                changeAllRecurringAmounts();
              },
            },
            cancel: {
              label: 'Cancel',
              className: 'btn-secondary',
            },
          },
        });
      };

      $saveIcon.on('mousedown', function () {
        // prompt ONLY if freq != one-time
        if (entryFreq === 'one-time') {
          $(this).blur(saveOneTime());
        } else if (entryFreq !== 'one-time') {
          $(this).blur(promptForRecurring());
        }
      });

      $input
        .keyup(function (event) {
          if (event.keyCode == 13) {
            // prompt ONLY if freq != one-time
            if (entryFreq === 'one-time') {
              $(this).blur(saveOneTime());
            } else if (entryFreq !== 'one-time') {
              $(this).blur(promptForRecurring());
            }
          } else if (event.keyCode == 27) {
            $(this).replaceWith($el);
            $saveIcon.toggleClass('d-none');
          }
        })
        .on('blur', function () {
          $(this).replaceWith($el);
          $saveIcon.toggleClass('d-none');
        })
        .focus();
    });

    // clear entry - update balance and either delete (one-time) or update date to next occurence (recurring)
    $('.fa-check').click(function (e) {
      bootbox.dialog({
        message:
          '<p>Are you sure you want to clear this entry?</p><p class="text-muted small">This entry will be removed, and its amount will be debited from or credited to your current balance. If this is a recurring series, only the first of the series will be cleared. This cannot be undone.</p>',
        centerVertical: true,
        buttons: {
          clear: {
            label: 'Clear',
            className: 'btn-success',
            callback: function () {
              const entryId = $(e.target).data('id');
              const amountToClear = $(e.target).data('amount-to-clear');
              const newClearedBalance =
                parseFloat(currentBalance.replace('$', '').replace(',', '')) +
                parseFloat(amountToClear);
              const dateString = $(
                `span[data-id="${entryId}"][data-date]`
              ).html();

              // convert dateString pulled from cell from slashes to dashes format
              const dateStringDashesNoTZ = convertSlashesToDashes(dateString);

              // add timeZoneOffsetStr to entry date and convert to JS date
              const dateStringJS = new Date(
                dateStringDashesNoTZ + timeZoneOffsetStr
              );

              // convert JS date to date string in dashes format
              const entryDateDashes = convertDateJsToStrDashes(dateStringJS);

              // add timeZoneOffsetStr to dateString, which is pulled from page, before converting to JS date
              let newDate = new Date(entryDateDashes + timeZoneOffsetStr);

              const entryFrequency = $(
                `span[data-id="${entryId}"][data-frequency]`
              ).html();

              $.post('/users/' + userId, {
                _method: 'PUT',
                user: {
                  current_balance: newClearedBalance,
                },
              });

              if (entryFrequency === 'one-time') {
                $.ajax({
                  type: 'DELETE',
                  url: '/entries/' + entryId,
                  success: setTimeout(
                    window.location.reload.bind(window.location),
                    100
                  ),
                });
              } else {
                if (entryFrequency === 'weekly') {
                  newDate.setDate(newDate.getDate() + 7);
                } else if (entryFrequency === 'bi-weekly') {
                  newDate.setDate(newDate.getDate() + 14);
                } else if (entryFrequency === 'monthly') {
                  newDate.setMonth(newDate.getMonth() + 1);
                } else if (entryFrequency === 'bi-monthly') {
                  newDate.setMonth(newDate.getMonth() + 2);
                } else if (entryFrequency === 'quarterly') {
                  newDate.setMonth(newDate.getMonth() + 3);
                } else if (entryFrequency === 'annually') {
                  newDate.setMonth(newDate.getMonth() + 12);
                }

                $.post('/entries/' + entryId, {
                  _method: 'PUT',
                  id: entryId,
                  entry: {
                    date: newDate,
                    success: setTimeout(
                      window.location.reload.bind(window.location),
                      200
                    ),
                  },
                });
              }
            },
          },
          cancel: {
            label: 'Cancel',
            className: 'btn-secondary',
          },
        },
      });
    });

    // delete entry
    $('.fa-trash-alt').click(function (e) {
      bootbox.dialog({
        message:
          '<p>Are you sure you want to delete this entry?</p><p class="text-muted small">This will permanently delete this entry and any recurrences of it. This cannot be undone.</p>',
        centerVertical: true,
        buttons: {
          delete: {
            label: 'Delete',
            className: 'btn-danger',
            callback: function () {
              const entryId = $(e.target).data('id');
              $.ajax({
                type: 'DELETE',
                url: '/entries/' + entryId,
                success: location.reload(),
              });
            },
          },
          cancel: {
            label: 'Cancel',
            className: 'btn-secondary',
          },
        },
      });
    });
  });

  const changeTimePeriod = function (months_to_display) {
    $.post('/users/' + userId, {
      _method: 'PUT',
      user: {
        months_to_display: months_to_display,
        success: setTimeout(window.location.reload(), 200),
      },
    });
  };

  const loadMore3 = document.querySelector('#load-more-3');
  const loadMore6 = document.querySelector('#load-more-6');
  const loadMore9 = document.querySelector('#load-more-9');
  const loadMore12 = document.querySelector('#load-more-12');
  const loadMore24 = document.querySelector('#load-more-24');
  const loadMore36 = document.querySelector('#load-more-36');
  const loadMore48 = document.querySelector('#load-more-48');
  const loadMore60 = document.querySelector('#load-more-60');

  loadMore3.addEventListener('click', function () {
    changeTimePeriod(3);
  });
  loadMore6.addEventListener('click', function () {
    changeTimePeriod(6);
  });
  loadMore9.addEventListener('click', function () {
    changeTimePeriod(9);
  });
  loadMore12.addEventListener('click', function () {
    changeTimePeriod(12);
  });
  loadMore24.addEventListener('click', function () {
    changeTimePeriod(24);
  });
  loadMore36.addEventListener('click', function () {
    changeTimePeriod(36);
  });
  loadMore48.addEventListener('click', function () {
    changeTimePeriod(48);
  });
  loadMore60.addEventListener('click', function () {
    changeTimePeriod(60);
  });

  window.setTimeout(function () {
    $('.alert').fadeTo(500, 0);
    this.setTimeout(function () {
      $('.close').click();
    }, 500);
  }, 4000);

  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });
});
