$(function() {
  var currentBalance = document.getElementById("currentBalance").innerHTML;
  var newEntryBalance = parseInt(currentBalance);

  // create new table row for each entry
  function createEntryRow(entry) {
    
    newEntryBalance = newEntryBalance + Math.round(entry.amount / 100.00);
    var entryColorClass = "";
    var currentDate = new Date();
    if (new Date(entry.date + "T00:00:00.000-04:00") < currentDate) {
      entryColorClass = " past-date ";
    } else if (parseInt(entry.amount) >= 0 && new Date(entry.date + "T00:00:00.000-04:00") >= currentDate) {
      entryColorClass = " credit ";
    }
    var entryRow = '<tr class="entryRow' + entryColorClass + '"><td><span data-date data-id="' + entry.id + '">' + entry.date + '</span></td><td><span data-description data-id="' + entry.id + '">' + entry.description + '</span></td><td><span data-frequency data-id="' + entry.id + '">' + entry.frequency + '</span></td><td><span data-amount data-id="' + entry.id + '">$' + Math.round(entry.amount / 100.00) + '</span></td><td>$' + newEntryBalance + '</td><td class="entry-actions-cell pl-2"><i class="fas fa-check"' + ' data-id="' + entry.id + '" data-user-id="' + entry.user_id + '" data-amount-to-clear="' + Math.round(entry.amount / 100.00) + '"></i><i class="far fa-trash-alt ml-2"' + ' data-id="' + entry.id + '"></i></td></tr>';
    return entryRow;
  }

  // get all entries for current user in JSON format
  $.get("/entries").success(function(data) {
    var allEntryRows = "";
    var userId = $('#currentBalance').data("user-id");

    $.each(data, function(index, entry) {
      allEntryRows += createEntryRow(entry);
    });

    var entriesTable = $('.entries-table');
    entriesTable.html(allEntryRows);

    // update current balance
    $('#currentBalanceCell').on('click', '[data-current-balance]', function() {
      var $el = $(this);
      var $input = $('<input type="number"/>').val($el.text());
      $el.replaceWith($input);
      
      var save = function(){
        var $span = $('<span data-current-balance id="currentBalance" />').text($input.val());
        $input.replaceWith($span);

        var updatedBalance = document.getElementById("currentBalance").innerHTML;
        
        $.post("/users/" + userId, {
          _method: "PUT",
          user: {
            current_balance: updatedBalance,
            success: location.reload()
          }
        });
      };
      
      $input.one('blur', save).focus();
    });

    // update date
    $('.entryRow').on('click', '[data-date]', function(e) {
      var entryId = $(e.target).data("id");
      var $el = $(this);
      var $input = $('<input type="date" />').val($el.text());
      $el.replaceWith($input);
      
      var save = function(){
        var $span = $('<span data-date id="updatedDateCell" />').text($input.val());
        $input.replaceWith($span);
        var updatedDate = document.getElementById("updatedDateCell").innerHTML;
        
        $.post("/entries/" + entryId, {
          _method: "PUT",
          id: entryId,
          entry: {
            date: updatedDate,
            success: location.reload()
          }
        });
      };
      
      $input.one('blur', save).focus();
    });

    // update description
    $('.entryRow').on('click', '[data-description]', function(e) {
      var entryId = $(e.target).data("id");
      var $el = $(this);
      var $input = $('<input/>').val($el.text());
      $el.replaceWith($input);
      
      var save = function(){
        var $span = $('<span data-description id="updatedDescriptionCell" />').text($input.val());
        $input.replaceWith($span);
        var updatedDescription = document.getElementById("updatedDescriptionCell").innerHTML;
        
        $.post("/entries/" + entryId, {
          _method: "PUT",
          id: entryId,
          entry: {
            description: updatedDescription,
            success: location.reload()
          }
        });
      };
      
      $input.one('blur', save).focus();
    });

    // update frequency
    $('.entryRow').on('click', '[data-frequency]', function(e) {
      var entryId = $(e.target).data("id");
      var $el = $(this);
      var $select = $('<select id="frequency-select"><option value="one-time">One-time</option><option value="weekly">Weekly</option><option value="bi-weekly">Bi-weekly</option><option value="monthly">Monthly</option><option value="bi-monthly">Bi-monthly</option><option value="quarterly">Quarterly</option><option value="annually">Annually</option></select>').val($el.text());
      $el.replaceWith($select);
      
      var save = function(){
        var $span = $('<span data-frequency id="updatedFrequencyCell" />').text($select.val());
        $select.replaceWith($span);
        var updatedFrequency = document.getElementById("updatedFrequencyCell").innerHTML;
        
        $.post("/entries/" + entryId, {
          _method: "PUT",
          id: entryId,
          entry: {
            frequency: updatedFrequency,
            success: location.reload()
          }
        });
      };
      
      $select.one('blur', save).focus();
    });

    // update amount
    $('.entryRow').on('click', '[data-amount]', function(e) {
      var entryId = $(e.target).data("id");
      var $el = $(this);
      var $input = $('<input type="number"/>').val($el.text());
      $el.replaceWith($input);

      var save = function(){
        var $span = $('<span data-amount id="updatedAmountCell" />').text($input.val());
        $input.replaceWith($span);

        var updatedAmount = document.getElementById("updatedAmountCell").innerHTML;
        
        $.post("/entries/" + entryId, {
          _method: "PUT",
          id: entryId,
          entry: {
            amount: updatedAmount,
            success: location.reload()
          }
        });
      };
      
      $input.one('blur', save).focus();
    });

    // clear entry - update balance and either delete (one-time) or update date to next occurence (recurring)
    $('.fa-check').click(function(e) {
      var entryId = $(e.target).data("id");
      // var entryDate = $(e.target).data("date");
      var amountToClear = $(e.target).data("amount-to-clear");
      var newClearedBalance = ((parseInt(currentBalance) + amountToClear) * 100);

      $.post("/users/" + userId, {
        _method: "PUT",
        user: {
          current_balance: newClearedBalance,
          success: location.reload()
        }
      });

      // this is calibrated for eastern time right now
      // I may add support for other time zones in the future
      var dateString = $("span[data-id='" + entryId + "'][data-date]").html() + "T00:00:00.000-04:00";
      var newDate = new Date(dateString);
      var entryFrequency = $("span[data-id='" + entryId + "'][data-frequency]").html();

      if (entryFrequency == "one-time") {
        $.ajax({
          type: "DELETE",
          url: "/entries/" + entryId
        });
      } else {
        // set isEarliest to true for entry in each conditional below
        // should only apply to first entry in recurring series
        // rest should stay false -- see notes in trello
        if (entryFrequency == "weekly") {
          newDate.setDate(newDate.getDate() + 7);
          // set isEarliest = true
        } else if (entryFrequency === "bi-weekly") {
          newDate.setDate(newDate.getDate() + 14);
          // set isEarliest = true, etc.
        } else if (entryFrequency === "monthly") {
          newDate.setMonth(newDate.getMonth()+1);
        } else if (entryFrequency === "bi-monthly") {
          newDate.setMonth(newDate.getMonth()+2);
        } else if (entryFrequency === "quarterly") {
          newDate.setMonth(newDate.getMonth()+3);
        } else if (entryFrequency === "annually") {
          newDate.setMonth(newDate.getMonth()+12);
        }

        $.post("/entries/" + entryId, {
          _method: "PUT",
          id: entryId,
          entry: {
            date: newDate,
            success: location.reload()
          }
        });
      }

      // this selects the date of a one-time entry
      // need to make this select the first of a recurring series

      // this works but JS is setting the new date one day early!

      
    });

    // delete entry
    $('.fa-trash-alt').click(function(e) {
      var entryId = $(e.target).data("id");

      $.ajax({
        type: "DELETE",
        url: "/entries/" + entryId,
        success: location.reload()
      });
    });
  });
});
