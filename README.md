hmpo-date-controller
====================

[![npm version](https://badge.fury.io/js/hmpo-date-controller.svg)](https://badge.fury.io/js/hmpo-date-controller)
[![Build Status](https://travis-ci.org/UKHomeOffice/passports-date-controller.svg)](https://travis-ci.org/UKHomeOffice/passports-date-controller)

A controller for the [hmpo-form-wizard] that provides out-of-the-box
support for [hmpo-template-mixins]' 'input-date' mixin. It is a drop-in
replacement for the standard controller and, if need be, can be
inherited from in your custom controllers.

My hope is that in the future this functionality will be merged into
[hmpo-form-controller] as that already seems to have some knowledge of
the date component fields provided by input-date.

Main Benefits
-------------

* No more silly custom controllers just so that date fields can be
  handled.
* The date validators from [hmpo-form-controller] can finally be
  leaveraged, giving us easy validation on date fields. (e.g. Date must
  not be in the future, person must be over 18 etc.)
* No more date components in the steps definition. (Surely a source of
  confusion for new developers?)
* The date components are also validated individually allowing a missing
  month, let's say, to be highlighted directly. The validators are
  automatically applied and come from [hmpo-form-controller]. i.e.
  'date-year', 'date-month' and 'date-day'. This gives the developer a
  lot of date validation for free helping to avoid bugs in their forms.

Quality Assurance
-----------------

In order to demonstrate that this controller provides the same
funcionality as its parents without regressions, the parents'
([hmpo-form-wizard]'s controller and [hmpo-form-controller] itself)
tests are run against it.

The new functionality is fully documented in the controller's own unit
test.

Whilst this is the first version of this module the code coverage is
100% as measured by [Istanbul]. This is tested for in CI to ensure new
changes do not introduce untested code.

Linting is also checked in CI using the `.eslintrc` from
[hmpo-form-controller].

Migrating from HOF's date-controller
------------------------------------

If you were using HOF's date-controller then you would have had a custom
controller which declared a single field as being the only date field.
You will also have added the date components to your steps definition.
None of this is required in hmpo-date-controller so your migration is
more about deleting this redundant code.

e.g. Consider the following steps definition:

```js
[...]
'/step-one': {
  controller: require('dob-controller'),
  fields: [
    'fullname',
    'date-of-birth',
    'date-of-birth-day',
    'date-of-birth-month',
    'date-of-birth-year',
    'nationality'
  ],
  next:
  '/step-two'
},
[...]
```

This can now become simply:

```js
[...]
'/step-one': {
  fields: [
    'fullname',
    'date-of-birth',
    'nationality'
  ],
  next:
  '/step-two'
},
[...]
```

This of course means that you are now free to have more than one date
field per step.

If you were doing any validation on the date you might need to add it to
the definition for the field.

The only thing left to do is to ensure the default controller is, or
inherits from, hmpo-date-controller.

[hmpo-form-controller]: https://github.com/UKHomeOffice/passports-form-controller
[hmpo-form-wizard]: https://github.com/UKHomeOffice/passports-form-wizard
[hmpo-template-mixins]: https://github.com/UKHomeOffice/passports-template-mixins
