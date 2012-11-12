(function (global, $, _) {
  "use strict";
  var sets
    ;

  function toDate(value) {
    var str = Object.prototype.toString.call(value);
    return str === "[object Date]" ? value : new Date(value);
  }

  function set(opts) {
    opts = opts || {};
    opts.date && (opts.date = toDate(opts.date));

    var me = $.extend({
      exercise: null
    , weight: null
    , reps: 0
    , date: new Date()
    }, (opts));

    return me;
  }

  function loadSets() {
    var loaded = localStorage && localStorage.getItem('weight-sets');
    loaded && (loaded = JSON.parse(loaded));

    sets = _(loaded).map(function (values) {
      return set(values);
    }) || [];
  }

  function saveSets() {
    localStorage && localStorage.setItem('weight-sets', JSON.stringify(sets));
  }

  function setFromForm(form) {
    var $form = $(form)
      , aSet
      ;

    aSet = set({
      exercise: $form.find('[name="exercise"]').val()
    , weight: $form.find('[name="weight"]').val()
    , reps: $form.find('[name="reps"]').val()
    });

    sets.push(aSet);
  }

  function renderSets() {
    var liTmp = _.template($('#list-template').html())
      , hdTmp = _.template($('#date-header').html())
      , fullList = ''
      , prevDay = -1
      ;

    _(sets).forEach(function (val) {
      var currDate = toDate(val.date);
      if (prevDay !== currDate.getDay()) {
        fullList += hdTmp(val);
      }

      fullList += liTmp(val);
      prevDay = currDate.getDay();
    });

    $('#sets').html(fullList);
  }

  $(function () {
    $("#new").submit(function (e) {
      setFromForm(this);
      renderSets();
      e.preventDefault();
      this.reset();
      window.setTimeout(saveSets, 0);
    });

    loadSets();
    renderSets();
  });
}(this, this.jQuery, this._));
