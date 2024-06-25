var Countdown = {
  // Backbone-like structure
  $el: $(".countdown"),

  // Params
  countdown_interval: null,
  total_seconds: 0,

  // Initialize the countdown
  init: function () {
    // DOM
    this.$ = {
      days: this.$el.find(".bloc-time.days .figure"),
      hours: this.$el.find(".bloc-time.hours .figure"),
      minutes: this.$el.find(".bloc-time.min .figure"),
      seconds: this.$el.find(".bloc-time.sec .figure"),
    };

    // Calculate the total seconds until the target date
    var targetDate = new Date("2024-06-26T08:30:00").getTime();
    var currentDate = new Date().getTime();
    var timeDifference = targetDate - currentDate;

    // Calculate initial days, hours, minutes, and seconds
    this.total_seconds = Math.floor(timeDifference / 1000);
    this.values = {
      days: Math.floor(this.total_seconds / (3600 * 24)),
      hours: Math.floor((this.total_seconds % (3600 * 24)) / 3600),
      minutes: Math.floor((this.total_seconds % 3600) / 60),
      seconds: this.total_seconds % 60,
    };

    // Animate countdown to the end
    this.count();
  },

  count: function () {
    var that = this,
      $day_1 = this.$.days.eq(0),
      $day_2 = this.$.days.eq(1),
      $hour_1 = this.$.hours.eq(0),
      $hour_2 = this.$.hours.eq(1),
      $min_1 = this.$.minutes.eq(0),
      $min_2 = this.$.minutes.eq(1),
      $sec_1 = this.$.seconds.eq(0),
      $sec_2 = this.$.seconds.eq(1);

    this.countdown_interval = setInterval(function () {
      if (that.total_seconds > 0) {
        // Update seconds
        --that.values.seconds;

        if (that.values.seconds < 0) {
          that.values.seconds = 59;
          --that.values.minutes;

          if (that.values.minutes < 0) {
            that.values.minutes = 59;
            --that.values.hours;

            if (that.values.hours < 0) {
              that.values.hours = 23;
              --that.values.days;

              if (that.values.days < 0) {
                // Countdown ended, do something here if needed
                clearInterval(that.countdown_interval);
                return;
              }
            }
          }
        }

        // Update DOM values
        // Days
        that.checkHour(that.values.days, $day_1, $day_2);

        // Hours
        that.checkHour(that.values.hours, $hour_1, $hour_2);

        // Minutes
        that.checkHour(that.values.minutes, $min_1, $min_2);

        // Seconds
        that.checkHour(that.values.seconds, $sec_1, $sec_2);

        --that.total_seconds;
      } else {
        clearInterval(that.countdown_interval);
      }
    }, 1000);
  },

  animateFigure: function ($el, value) {
    var that = this,
      $top = $el.find(".top"),
      $bottom = $el.find(".bottom"),
      $back_top = $el.find(".top-back"),
      $back_bottom = $el.find(".bottom-back");

    // Before we begin, change the back value
    $back_top.find("span").html(value);

    // Also change the back bottom value
    $back_bottom.find("span").html(value);

    // Then animate
    TweenMax.to($top, 0.8, {
      rotationX: "-180deg",
      transformPerspective: 300,
      ease: Quart.easeOut,
      onComplete: function () {
        $top.html(value);
        $bottom.html(value);
        TweenMax.set($top, { rotationX: 0 });
      },
    });

    TweenMax.to($back_top, 0.8, {
      rotationX: 0,
      transformPerspective: 300,
      ease: Quart.easeOut,
      clearProps: "all",
    });
  },

  checkHour: function (value, $el_1, $el_2) {
    var val_1 = Math.floor(value / 10),
      val_2 = value % 10,
      fig_1_value = $el_1.find(".top").html(),
      fig_2_value = $el_2.find(".top").html();

    // Animate only if the figure has changed
    if (fig_1_value !== val_1.toString()) this.animateFigure($el_1, val_1);
    if (fig_2_value !== val_2.toString()) this.animateFigure($el_2, val_2);
  },
};

// Initialize countdown
Countdown.init();

//Hide the countdown when the page loads
$(".wrap").hide();

// If the button with id "hide" is clicked, hide the "wrap" class, otherwise show it if it is hidden (change the name to show )
$("#hide").click(function () {
  // Animate the showing//hiding of the countdown
  $(".wrap").slideToggle();

  //change the name of the button to show if it is hidden
  if ($("#hide").text() == "Hide Countdown") {
    $("#hide").text("Show Countdown");
  } else {
    $("#hide").text("Hide Countdown");
  }
});
