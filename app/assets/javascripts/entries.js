$(function() {
  var currentBalance = document.getElementById("currentBalance").innerHTML;

  // create new table row for each entry
  function createEntryRow(entry) {
    var newEntryBalance = parseInt(currentBalance);
    newEntryBalance = newEntryBalance + Math.round(entry.amount / 100.00);
    var entryColorClass = "";
    var currentDate = new Date();
    if (new Date(entry.date) < currentDate) {
      entryColorClass = " past-date ";
    } else if (parseInt(entry.amount) >= 0 && new Date(entry.date) >= currentDate) {
      entryColorClass = " credit ";
    }
    var entryRow = '<tr class="entryRow' + entryColorClass + '"><td><span data-date data-id="' + entry.id + '">' + entry.date + '</span></td><td><span data-description data-id="' + entry.id + '">' + entry.description + '</span></td><td><span data-frequency data-id="' + entry.id + '">' + entry.frequency + '</span></td><td><span data-amount data-id="' + entry.id + '">$' + Math.round(entry.amount / 100.00) + '</span></td><td>$' + newEntryBalance + '</td><td class="entry-actions-cell pl-2"><i class="fas fa-check"' + ' data-id="' + entry.id + '" data-user-id="' + entry.user_id + '" data-amount-to-clear="' + Math.round(entry.amount / 100.00) + '"></i><i class="far fa-trash-alt ml-2"' + ' data-id="' + entry.id + '"></i></td></tr>';
    return entryRow;
  }

  // get all entries for current user in JSON format
  $.get("/entries").success(function(data) {
    var allEntryRows = "";
    var numRows = 100;
    var userId = $('#currentBalance').data("user-id");

    $.each(data, function(index, entry) {
      allEntryRows += createEntryRow(entry);

      // tried this in rails first but now trying in js
      // problem in js is getting date format to match what rails has already outputted
      if (entry.frequency === "weekly") {
        var entryDate = new Date(entry.date);
        entryDate.setDate(entryDate.getDate() + 7);
        entry.date = new Intl.DateTimeFormat('en-US').format(entryDate);
        allEntryRows += createEntryRow(entry);
      }
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
            current_balance: updatedBalance
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

    // clear entry - delete and update balance
    $('.fa-check').click(function(e) {
      var entryId = $(e.target).data("id");
      var amountToClear = $(e.target).data("amount-to-clear");
      var newClearedBalance = ((parseInt(currentBalance) + amountToClear) * 100);

      $.post("/users/" + userId, {
        _method: "PUT",
        user: {
          current_balance: newClearedBalance
        }
      });

      $.ajax({
        type: "DELETE",
        url: "/entries/" + entryId
      });
    });

    // delete entry
    $('.fa-trash-alt').click(function(e) {
      var entryId = $(e.target).data("id");

      $.ajax({
        type: "DELETE",
        url: "/entries/" + entryId
      });
    });
  });
});
