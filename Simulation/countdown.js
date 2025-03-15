var Countdown = {
  // Backbone-like structure
  $el: $(".countdown"),

  // Params
  countdown_interval: null,
  total_seconds: 0,
  isRunning: false,
  targetDate: new Date("2025-06-24T08:30:00"),

  // Initialize the countdown
  init: function () {
    // DOM
    this.$ = {
      days_hundreds: this.$el.find(".figure.days-hundreds"),
      days_tens: this.$el.find(".figure.days-tens"),
      days_ones: this.$el.find(".figure.days-ones"),
      hours_tens: this.$el.find(".figure.hours-tens"),
      hours_ones: this.$el.find(".figure.hours-ones"),
      minutes_tens: this.$el.find(".figure.min-tens"),
      minutes_ones: this.$el.find(".figure.min-ones"),
      seconds_tens: this.$el.find(".figure.sec-tens"),
      seconds_ones: this.$el.find(".figure.sec-ones")
    };

    // Check if exam has already started
    this.checkExamStatus();
    
    // Start the countdown if exam hasn't started yet
    if (!this.examStarted) {
      this.count();
    }
    
    // Update countdown every minute to handle page being inactive
    setInterval(() => this.checkExamStatus(), 60000);
    
    // Add event listener for visibility change
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        this.checkExamStatus();
      }
    });
  },
  
  checkExamStatus: function() {
    var currentDate = new Date();
    var timeDifference = this.targetDate - currentDate;
    
    // Handle case where countdown has ended
    if (timeDifference <= 0) {
      this.examStarted = true;
      this.total_seconds = 0;
      this.values = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
      
      // Update DOM with zeros
      this.updateDOM();
      
      // Show exam started UI
      this.showExamStarted();
      
      if (this.isRunning) {
        clearInterval(this.countdown_interval);
        this.isRunning = false;
      }
      
      return;
    }

    // Calculate initial days, hours, minutes, and seconds
    this.examStarted = false;
    this.total_seconds = Math.floor(timeDifference / 1000);
    this.values = {
      days: Math.floor(this.total_seconds / (3600 * 24)),
      hours: Math.floor((this.total_seconds % (3600 * 24)) / 3600),
      minutes: Math.floor((this.total_seconds % 3600) / 60),
      seconds: this.total_seconds % 60,
    };
    
    // Update DOM immediately
    this.updateDOM();
    
    // Show countdown UI
    this.showCountdown();
  },
  
  showExamStarted: function() {
    $(".wrap h1").html("JUDGEMENT DAY <span class='highlight'>HAS ARRIVED</span>");
    
    // Make sure we have the good luck message
    if ($(".good-luck").length === 0) {
      $(".countdown").after("<div class='good-luck'>GOOD LUCK!</div>");
    }
    
    // Make sure we have the exam date
    if ($(".exam-date").length === 0) {
      $(".wrap").append("<div class='exam-date'>26 IUNIE 2025 - 08:30</div>");
    }
  },
  
  showCountdown: function() {
    $(".wrap h1").html("JUDGEMENT <span class='highlight'>DAY</span>");
    
    // Remove good luck message if it exists
    $(".good-luck").remove();
    
    // Make sure we have the exam date
    if ($(".exam-date").length === 0) {
      $(".wrap").append("<div class='exam-date'>26 IUNIE 2025 - 08:30</div>");
    }
  },
  
  updateDOM: function() {
    // Calculate each digit
    var days = this.values.days;
    var days_hundreds = Math.floor(days / 100);
    var days_tens = Math.floor((days % 100) / 10);
    var days_ones = days % 10;
    
    var hours_tens = Math.floor(this.values.hours / 10);
    var hours_ones = this.values.hours % 10;
    
    var minutes_tens = Math.floor(this.values.minutes / 10);
    var minutes_ones = this.values.minutes % 10;
    
    var seconds_tens = Math.floor(this.values.seconds / 10);
    var seconds_ones = this.values.seconds % 10;
    
    // Update DOM
    this.$.days_hundreds.find("span").text(days_hundreds);
    this.$.days_tens.find("span").text(days_tens);
    this.$.days_ones.find("span").text(days_ones);
    
    this.$.hours_tens.find("span").text(hours_tens);
    this.$.hours_ones.find("span").text(hours_ones);
    
    this.$.minutes_tens.find("span").text(minutes_tens);
    this.$.minutes_ones.find("span").text(minutes_ones);
    
    this.$.seconds_tens.find("span").text(seconds_tens);
    this.$.seconds_ones.find("span").text(seconds_ones);
  },

  count: function () {
    var that = this;

    this.isRunning = true;
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
                // Countdown ended
                clearInterval(that.countdown_interval);
                that.isRunning = false;
                that.examStarted = true;
                
                // Show exam started UI
                that.showExamStarted();
                return;
              }
            }
          }
        }

        // Update DOM values
        that.updateDOM();

        --that.total_seconds;
      } else {
        clearInterval(that.countdown_interval);
        that.isRunning = false;
      }
    }, 1000);
  }
};

// Initialize countdown
$(document).ready(function() {
  // Fix scrollbar issues
  $('html, body').css({
    'overflow-x': 'hidden',
    'width': '100%',
    'height': '100%'
  });
  
  Countdown.init();

  // Hide the countdown when the page loads if not previously shown
  const savedVisibility = localStorage.getItem('countdownVisible');
  if (savedVisibility !== 'true') {
    $(".wrap").hide();
    $("#hide").text("Show Countdown");
  } else {
    $("#hide").text("Hide Countdown");
  }

  // Toggle countdown visibility with animation
  $("#hide").click(function () {
    // Animate the showing/hiding of the countdown
    $(".wrap").slideToggle(400);

    // Change button text with animation
    if ($("#hide").text() == "Hide Countdown") {
      $(this).text("Show Countdown");
    } else {
      $(this).text("Hide Countdown");
      
      // Update countdown when shown
      Countdown.checkExamStatus();
    }
    
    // Save preference
    localStorage.setItem('countdownVisible', $(".wrap").is(":visible"));
  });
  
  // Add hover effects to buttons
  $(".grid button").hover(
    function() {
      $(this).css("transform", "translateY(-3px)");
      $(this).css("box-shadow", "0 7px 14px rgba(0, 0, 0, 0.2)");
    },
    function() {
      $(this).css("transform", "translateY(0)");
      $(this).css("box-shadow", "0 4px 6px rgba(0, 0, 0, 0.1)");
    }
  );
  
  // Ensure content fits properly
  function adjustContentHeight() {
    var windowHeight = $(window).height();
    var contentHeight = $('.content-wrapper').outerHeight() + $('.wrap').outerHeight() + 100;
    
    if (contentHeight > windowHeight) {
      $('.app').css('height', 'auto');
    } else {
      $('.app').css('height', '100vh');
    }
  }
  
  // Run on load and resize
  adjustContentHeight();
  $(window).resize(adjustContentHeight);

  // Improve mobile responsiveness
  function enhanceMobileResponsiveness() {
    // Check if we're on a mobile device
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // Adjust button text for better mobile display
      $('.grid.grid-13 button').each(function() {
        const text = $(this).text().trim();
        
        // Shorten long button texts
        if (text === "Algoritmi si Structuri de Date") {
          $(this).text("Algoritmi si Structuri");
        } else if (text === "Sisteme de Gestiune a Bazelor de Date") {
          $(this).text("SGBD");
        } else if (text === "Programare Procedurala") {
          $(this).text("Prog. Procedurala");
        } else if (text === "Tehnici Avansate de Programare") {
          $(this).text("TAP");
        } else if (text === "Retele de Calculatoare") {
          $(this).text("Retele");
        } else if (text === "Sisteme de Operare") {
          $(this).text("SO");
        } else if (text === "Tehnologii Web") {
          $(this).text("Web");
        } else if (text === "Comert Electronic") {
          $(this).text("Comert E.");
        } else if (text === "Cloud Computing") {
          $(this).text("Cloud");
        }
      });
    }
  }
  
  // Run on load and resize
});