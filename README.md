# Balance Forecast

A simple financial ledger that forecasts account balance at future dates based on user-inputted debits and credits. Data protected by user authentication.

## URL

[https://www.balanceforecast.com/](https://www.balanceforecast.com/)

## Users

Use the 'Sign up' link below the 'Log in' form to create a new user. Creating a user will store your current balance and all of your entries.

![bf-sign-up](https://user-images.githubusercontent.com/24740660/110895480-d9da5780-82c7-11eb-8a3c-f477466d0414.gif)

Once your user is created, you can use the 'Log in' form to sign into the application.

## Editing your current balance

To edit your current balance, simply click onto it. This will turn that field into an input, which you can then edit.

To save your changes:
* Press 'Enter'
* Click the Save icon (floppy disk) next to the input field

![bf-edit-curbal](https://user-images.githubusercontent.com/24740660/110897228-10fe3800-82cb-11eb-957f-000e4e9eb6a9.gif)

## Adding an entry

Enter the date, description, frequency, and amount of the entry and then click 'Add.'

![bf-add-entry](https://user-images.githubusercontent.com/24740660/110897237-1491bf00-82cb-11eb-854a-649972c11435.gif)

Note:
* If the entry will be a recurring entry, choose the date of the first occurence for the date field.
* 'One-time' is the only non-recurring frequency. All other frequencies will automatically generate recurring entries up until the end of the time period currently selected.
* **You MUST include the negative sign (-) in the amount field if the entry is a debit.** Otherwise, the amount will be considered a credit and will be added to your balance instead of deducted from it.

## Editing an entry

To edit an entry, simply click onto the field you would like to edit. This will turn that field into an input, which you can then edit.

To save your changes:
* Press 'Enter'
* Click the Save icon (floppy disk) next to the input field

To cancel your changes:
* Press 'Escape'
* Press 'Tab' to move to the next field
* Click outside of the input

![bf-edit-entry](https://user-images.githubusercontent.com/24740660/110897245-18bddc80-82cb-11eb-8cdd-69d602474006.gif)

**NOTE: You MUST include the negative sign (-) in the amount field if the entry is a debit.** Otherwise, the amount will be considered a credit and will be added to your balance instead of deducted from it.

### Editing the amount of a recurring entry

When editing the amount on a recurring entry, you will be prompted whether to change the 'Earliest Entry Only' or 'All Entries.'

![bf-earliest](https://user-images.githubusercontent.com/24740660/110897266-21161780-82cb-11eb-8231-fe4f6a8474a8.gif)

* **Earliest Entry Only** - This will change the amount only on the earliest entry in the recurring series and convert its frequency to one-time. The purpose of this feature is to be able to keep track of money spent within one time period without changing the budgeted amount for that time period for future recurrences. For example, an entry may be made for a weekly grocery budget of $100. Once $50 has been spent within the current week, the amount for that week can be changed to $50, while all future weeks remain set to $100.
* **All Entries** - This will change the amount of all entries in the recurring series and does not change the frequency of any entries within the series.

**NOTE: You MUST include the negative sign (-) in the amount field if the entry is a debit.** Otherwise, the amount will be considered a credit and will be added to your balance instead of deducted from it.

## Clearing an entry

Clearing an entry means that the entry has cleared from your bank and the amount is credited to or debited from your balance.

To clear an entry, click the Clear icon (checkmark) on the far right end of the entry row. You will be prompted to confirm.

![bf-clear](https://user-images.githubusercontent.com/24740660/110897284-2bd0ac80-82cb-11eb-9225-a4466ed83bc0.gif)

## Deleting an entry

Deleting an entry will remove the entry from the ledger without changing your current balance.

To delete an entry, click the Delete icon (trash bin) on the far right end of the entry row. You will be prompted to confirm.

![bf-delete](https://user-images.githubusercontent.com/24740660/110897295-31c68d80-82cb-11eb-9405-6073d06da3b7.gif)

## Time period to display

This will determine how far out recurring entries will be generated.

![bf-time-period](https://user-images.githubusercontent.com/24740660/110897308-368b4180-82cb-11eb-9f1a-69998fcc3cd4.gif)

Note: This only applies to recurring entries. 'One-time' entries will be displayed regardless of the time period set.

## RSpec

This application has been developed with Test-Driven Development using RSpec. To run all tests, once you have cloned the repository to your local environment and installed all gems, run the following command:

```ruby
bundle exec rspec
```

## Tech used

* [JavaScript](https://www.javascript.com/) for entry generation, calculcations, and DOM manipulation
* [Rails](https://rubyonrails.org/) (5.0.7.2)
* [RSpec](https://rspec.info/) (3.9.2)
* [Bootstrap](https://getbootstrap.com/) (4.5.0)
* [Devise](https://github.com/plataformatec/devise) (4.7.2)
* [Bootbox](http://bootboxjs.com/) (0.5.0)

## Known bugs

* 'Add' button not working after clicking logo to go to root / requires reload
* A very old date on a recurring entry will generate lots of recurring entries
* After escaping out of input field, clicking Save icon does not save change
* 'Forgot password' email not working

Please feel free to [reach out to me](mailto:danny@dannypoit.com) to report any bugs or provide any suggestions!

## Authors

* **[Danny Poit](https://github.com/dannypoit)**
