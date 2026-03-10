var appVersion = 123456789; // DO NOT CHANGE, it is not versioned here on GitHub, that wouldn't make sense
var imgShardDomains = 'gin';
var maxUploadSize = 75*1024*1024;
var feedID2no = {};
var feedData = {};
var feedLength = 0;
var feedRows = [];
var clusterize;
var scrollDirection = 0;
var scrollJumping = 0;
var scrollDownAuto = 0;
var tabSwipeEnabled = true;
var currentTabNr = 1;
var highlightedPost = null;
var locationData = {'089':'München'};
var locationList = ['089 - München'];
var nearLocations = [];
var hashtagHistory = [];
var hashtagRE, nametagRE, unicodeWordRE;
var mediaRecorder, captureTimeUpdateInterval;
var modalFallback;
var videoPostData;
var videoBlank;
var videoData = {};
var autofocus = !phonon.event.hasTouch;
var ownUID = $('body').data('uid') || $('body').attr('data-uid');
var ownNoList = [];
var textLinks = {
  'ffmeet': {
    match: /(https:\/\/)?ffmeet\.net\/jc[0-9a-zA-Z]{3,}/i,
    href: '$url',
    title: 'Externer Link zu Freifunk München Jitsi',
    message: 'FFMEET ist der freie Jitsi-Konferenzserver von Freifunk München, der Videokonferenzen ohne Anmeldung, Werbung, Tracking, Logging, etc. ermöglicht.',
    btnyes: 'Link öffnen',
    btnno: 'Abbrechen'
  },
  'youtube': {
    match: /(https:\/\/)?youtu\.be\/[-0-9a-zA-Z?&=_]{8,}/i,
    href: '$url',
    title: 'Externer Link zu YouTube',
    message: 'YouTube Link',
    btnyes: 'Link öffnen',
    btnno: 'Abbrechen'
  },
  'telegram': {
    match: /(https:\/\/)?t\.me\/[a-zA-Z][a-zA-Z0-9_]{3,30}[a-zA-Z0-9]/i,
    href: '$url',
    title: 'Externer Link zu Telegram',
    message: 'Telegram Link',
    btnyes: 'Link öffnen',
    btnno: 'Abbrechen'
  },
  'mc': {
    match: /(?:meeting|meet|(?:privat|versteckt)(?:|e|e[rsnm]))\s*[-]?\s*(?:channels?|chats?|kanal|kanäle|raum|räume|room)|(?:(?:privat|allein|zu zweit|unter sich|unter vier augen|unter 4 augen)(?:\s*(?:mit mir|mit dir|miteinander|zu|mal|wieder|ein|einmal|nochmal))*\s*(?:schreiben|treffen|unterhalten|quatschen))|MC/,
    href: '#!faq/meetingchannel',
    title: 'FAQ: Meetingchannels',
    message: 'Auf jodel.city gibt es mit den sogenannten »Meetingchannels« auch eine Möglichkeit sich "privat" mit jemandem auszutauschen.',
    btnyes: 'Mehr Details',
    btnno: 'Nein danke'
  },
  'faq': {
    match: /FAQ[\W]?s|FAQ/,
    href: '#!faq',
    title: 'FAQ: Häufige gestellte Fragen'
  },
  'tg': {
    match: /telegram|tg/,
    href: '#!faq/kik',
    title: 'FAQ: Telegram Messenger',
    message: 'Telegram ist eine Chat-App ähnlich wie WhatsApp, Kontakte können allerdings anstatt per Handynummer auch über den Austausch eines frei wählbaren Telegram-Benutzernamens geknüpft werden und man bleibt somit anonym. Die öffentlichen jodel.city-Channels sind allerdings nicht der richtige Ort um ungefragt seinen Kontakt weiterzugeben bzw. andere nach ihren Accounts zu fragen...',
    btnyes: 'Mehr Info',
    btnno: 'Verstanden'
  },
  'kik': {
    match: /kik|k+\W*[1ij]+\W*k+/,
    href: '#!faq/kik',
    title: 'FAQ: Kik Messenger',
    message: 'Kik ist eine Chat-App für Smartphones ähnlich wie WhatsApp, Kontakte werden allerdings anstatt per Handynummer über den Austausch eines frei wählbaren Kik-Nicknamens geknüpft und man bleibt somit anonym. Die öffentlichen jodel.city-Channels sind allerdings nicht der richtige Ort um ungefragt seinen Nick weiterzugeben bzw. andere nach ihren Nicks zu fragen...',
    btnyes: 'Mehr Info',
    btnno: 'Verstanden'
  },
  'snapchat': {
    match: /sc|snapchat|snap\s*chat/,
    href: '#!faq/kik',
    title: 'FAQ: Snapchat',
    message: 'Snapchat, kennt jeder. Die öffentlichen jodel.city-Channels sind allerdings nicht der richtige Ort um ungefragt seine Nicknames/Kontaktdaten zu hinterlassen bzw. andere danach zu fragen...',
    btnyes: 'Mehr Info',
    btnno: 'Verstanden'
  },
  'phash': {
    match: /[äöa]e?h?nlichkeit|99\s*prozent|(?:[0-9]{2,3})\s*(?:\%|prozent)\s*[äöa]e?h?n\w*/,
    href: '#!faq/phash',
    title: 'FAQ: Ähnlichkeit',
    message: 'Alle Bilder werden automatisch mit allen in der Vergangenheit geposteten Bilder verglichen... Falls ein Bild mit einer Ähnlichkeits-Angabe angezeigt wird ist das Foto wahrscheinlich ein Repost.',
    btnyes: 'Mehr Info',
    btnno: 'Verstanden'
  },
  'purge': {
    match: /alles weg|gel[öoe]+scht|purge|flush|reset/,
    href: '#!faq/purge',
    title: 'FAQ: Purge',
    message: 'Zwei mal täglich werden alle Posts hier auf jodel.city gelöscht: 09:59 Uhr morgens und 21:59 Uhr abends',
    btnyes: 'Mehr Info',
    btnno: 'Verstanden'
  },
  'recordvideo': {
    match: /video|filmen/,
    href: 'javascript:return false;',
    title: 'FAQ: Video aufnehmen',
    message: 'Im Foto-Tab findest du unten einen Button mit drei Punkten (⋅⋅⋅), mit diesem kannst du das Aufnahmeoptionen-Menü ausklappen und von Foto auf Video wechseln und dort dann ein Video aufnehmen.',
    btnyes: '',
    btnno: 'Alles klar'
  },
  'reload': {
    match: /seite neu laden|seite aktualisieren/,
    href: 'javascript:window.location.replace(window.location.pathname);',
    title: 'Seite neu laden',
    message: 'Es kann hin und wieder vorkommen, dass diese Seite plötzlich nicht mehr korrekt funktioniert... Dagegen hilft es meistens die Seite einfach einmal neu zu laden. Möchtest du die Seite jetzt neu laden?',
    btnyes: 'Ja, neu laden',
    btnno: 'Nein, abbrechen'
  }
};
var dbgLog = '';
var dbg = 0; /* 0: no debug log, 1: console.log, 2: Ajax-POST to errorlog, 4: store log in variable to display in textarea */

// if(document.location.href.match(/2345/)) dbg=2;
// if(Lockr.get('Nametag') == '#debug' || Lockr.get('Nametag') == '#admin') dbg|=4;
Lockr.rm('Location');

if($ && $.ajax) {
  $.ajax({url:"/000?authtoken", xhrFields: {withCredentials: true}});
  var authtokenInterval = setInterval(function() {
    $.ajax({url:"/000?authtoken", xhrFields: {withCredentials: true}});
  }, 300000);
}

if(document && document.addEventListener) {
  document.addEventListener('visibilitychange', function() {
    if(!document.hidden && $ && $.ajax) {
      log('Visibility change: refreshing authtoken');
      $.ajax({url:"/000?authtoken", xhrFields: {withCredentials: true}});
    }
  });
}

function log() {
  if(!dbg) return;
  if(dbg&1 && window && window.console && window.console.log) {
    window.console.log.apply(window.console, arguments);
  }
  if(dbg&4) {
    dbgLog += (new Date()).toLocaleTimeString() + ': ' + JSON.stringify(arguments) + '\n';
  }
  if(dbg&2 && $ && $.ajax) {
    $.ajax({
      type: "POST",
      url:"/?errorlog=dbg-"+dbg+'-'+arguments.length,
      data: JSON.stringify(arguments),
      cache: false
    });
  }
}

(function($) {
  $.timeago.settings.refreshMillis = 0;
  $.timeago.settings.strings.seconds = 'kurzem';
})(Zepto);

(function($) {
  var onStart = Dragend.prototype._onStart;
  Dragend.prototype._onStart = function(t) {
    if(!tabSwipeEnabled) {
      // log('tab swipe disabled');
      return true;
    }
    onStart.apply(this,arguments);
  };
})();

var useFallback = undefined, useStorage = true;
if(!navigator.mediaDevices) useFallback = true;
// useFallback = true;

Lockr.rm('TagModeOff');

var HTML_ENTITIES = {
  '&': '&amp;',
  '>': '&gt;',
  '<': '&lt;',
  '"': '&quot;',
  "'": '&#39;'
};

var htmlEscape = function(text) {
  return text && text.replace(/[&"'><]/g, function(character) {
    return HTML_ENTITIES[character];
  });
};

var confirmExit = {};
if(dbg&2) window.onerror = function (msg, url, line) {
  if(!line) line = 1;
  $.ajax({
    type: "POST",
    url:"/?errorlog="+line,
    data: JSON.stringify(arguments),
    cache: false
  });
  window.console.log(Array.prototype.slice.call(arguments));
  return true;
}
window.onload = function () {
    if (typeof history.pushState === "function") {
        history.pushState("jibberish", null, null);
        window.onpopstate = function () {
            // Handle the back (or forward) buttons here
            // Will NOT handle refresh, use onbeforeunload for this.
            log('popState', phonon.navigator().currentPage, currentTabNr, document.location.hash);
            if(phonon.navigator().currentPage == 'home') {
              if($('body').hasClass('snapjs-left')) {
                phonon.sidePanel('#side-home').close();
              } else {
                if(currentTabNr == 1) { 
                  if(!document.location.hash || !document.location.hash.match(/^#!(photo|vid)/)) {
                    if($('#feed')[0].scrollTop > 15) {
                      $('#feed').scrollToTop(200);
                      scrollDirection = 0;
                    } else {
                      if(!document.location.hash || document.location.hash == '#!home') {
                        history.pushState('newjibberish', null, null);
                        if(confirmExit == null) {
                          confirmExit = phonon.confirm("Möchtest du die App verlassen?", "JodelCity", true, "Ja, verlassen", "Nein, hier bleiben");
                          confirmExit.on('confirm', function() {
                            window.location.replace('/?close');
                            confirmExit = null;
                          });
                          confirmExit.on('cancel', function() {
                            confirmExit = null;
                          });
                        } else {
                          phonon.dialogUtil.closeActive();
                          confirmExit = null;
                        }
                      }
                    }
                  } else {
                    history.pushState('newjibberish', null, null);
                  }
                } else {
                  changeTab(1);
                }
              }
            } else if(phonon.navigator().currentPage == 'vid') {
              log('leaving vid', document.location.hash);
            } else if(phonon.navigator().currentPage == 'slideshow') {
              log('leaving slideshow', document.location.hash);
            } else {
              history.pushState('newjibberish', null, null);
              phonon.navigator().changePage('home');
              // if(document.location.hash) history.replaceState('#!home', null, null);
            }
        };
    }
    else {
        var ignoreHashChange = true;
        window.onhashchange = function () {
            if (!ignoreHashChange) {
                ignoreHashChange = true;
                window.location.hash = Math.random();
                // Detect and redirect change here
                // Works in older FF and IE9
                // * it does mess with your hash symbol (anchor?) pound sign
                // delimiter on the end of the URL
            }
            else {
                ignoreHashChange = false;   
            }
        };
    }
}

// imitate longTap for desktop browsers
var desktopTouchHandler = function(event)
{
    var type = "", SimulatedEvent = ("onpointerdown" in document ? PointerEvent : MouseEvent);

    switch(event.type)
    {
        case "mousedown": type = "onpointerdown" in document ? "pointerdown" : "touchstart"; break;
        case "mousemove": type = "onpointerdown" in document ? "pointermove" : "touchmove";  break;        
        case "mouseup":   type = "onpointerdown" in document ? "pointerup"   : "touchend";   break;
        default: return;
    }

    var simulatedEvent = new SimulatedEvent(type, {
            pointerId: 1,
            bubbles: true,
            cancelable: true,
            pointerType: "touch",
            isPrimary: true,
            screenX: event.screenX,
            screenY: event.screenY,
            clientX: event.clientX,
            clientY: event.clientY,
            view: window,
            detail: 1,
            button: 0
        });

    simulatedEvent.touches = [{
        target: event.target,
        identifier: Date.now(),
        pageX: event.pageX,
        pageY: event.pageY,
        screenX: event.screenX,
        screenY: event.screenY,
        clientX: event.clientX,
        clientY: event.clientY
    }];

    event.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

var refreshHashtagButtons = function() {
    if(!hashtagHistory || !hashtagHistory.length) hashtagHistory = [];
    if(hashtagHistory.length > 20) hashtagHistory.length = 20;
    Lockr.set('HashtagHistory', hashtagHistory);
    var i, buttons = $('#hashtagbtns').find('button');
    for(i = 0; i < hashtagHistory.length; i++) {
      var btn;
      if(buttons.length > i) {
        // reuse
        buttons[i].disabled = false;
        btn = $(buttons[i]);
      } else {
        // new button
        btn = $('<button class="btn hashtagbtn" tabindex="-1"></button>');
        $('#hashtagbtns').append(btn);
      }
      var text = hashtagHistory[i];
      if(text[0] != '#' && text[0] != '@') text = '#'+text;
      $(btn).text(text);
      $(btn).removeProp('disabled');
    }
    for(;i < buttons.length; i++) {
      buttons[i].remove();
    }
}

var init = function(net) {
  if(net && net.cities && net.cities.length) {
    nearLocations = net.cities;
    Lockr.set('LocationsNear', nearLocations);
    if(!$('#location').val()) {
      var areacode = net.cities[0].areacode;
      var city = net.cities[0].name;
      if(city) {
        var preset = areacode + ' - ' + city;
        $('#location').val(preset);
        $('#locationform').attr('data-preset', preset);
        Lockr.set('LocationName', city);
      }
    }
    if(!hashtagHistory || !hashtagHistory.length) {
      for(i = 0; i < nearLocations.length; i++) {
        var tag = nearLocations[i].name.match(unicodeWordRE);
        if(tag && tag.length) hashtagHistory.push(tag[0]);
      }
      refreshHashtagButtons();
    }
  }
};

if(hashtagHistory = Lockr.get('HashtagHistory')) {
  $(function() {
    refreshHashtagButtons();
  });
} else {
  hashtagHistory = [];
}

if(Lockr.get('LocationCity') || $('#location').val()) {
  init = null;
  nearLocations = Lockr.get('LocationsNear') || [];
}

$('#locationform').attr('data-preset', $('#location').val());

function setTopic(topic) {
  $('#title-bar').text(topic);
  document.title = topic + ' - JodelCity';
}

phonon.options({
    navigator: {
        defaultPage: 'home',
        animatePages: true,
        enableBrowserBackButton: false,
        templateRootDirectory: '',
        // defaultTemplateExtension: 'html',
        useHash: true
    },
    i18n: null
});

var app = phonon.navigator();

$.fn.scrollToTop = function(duration) {
    var $el = this;
    var el  = $el[0];
    var startPosition = el.scrollTop;
    var maxDelta = 1500;
    if(startPosition > maxDelta) {
      startPosition = maxDelta;
    }

    var startTime = Date.now();
    scrollJumping++;

    function scroll() {
        var fraction = Math.min(1, (Date.now() - startTime) / duration);

        el.scrollTop = startPosition * (1-fraction);

        if(fraction < 1) {
            setTimeout(scroll, 10);
        } else {
            scrollJumping--;
        }
    }
    scroll();
};
$.fn.scrollToBottom = function(duration) {
    var $el = this;
    var el  = $el[0];
    var startPosition = el.scrollTop;
    var maxDelta = 1500;
    var delta = el.scrollHeight - $el.height() - startPosition;
    if(delta > maxDelta) {
      startPosition += delta - maxDelta;
      delta = maxDelta;
    }

    var startTime = Date.now();
    scrollJumping++;

    function scroll() {
        var fraction = Math.min(1, (Date.now() - startTime) / duration);

        el.scrollTop = delta * fraction + startPosition;

        if(fraction < 1) {
            setTimeout(scroll, 10);
        } else {
            scrollJumping--;
        }
    }
    scroll();
};

var lastFeedScrollPos = 0;
var feed = document.querySelector('#feed');
var updateFlacBtnVisibility = function() {
    if(feed.clientHeight + feed.scrollTop > feed.scrollHeight - 15)
        $('#flacbtn').addClass('scrolledToBottom');
    else
        $('#flacbtn').removeClass('scrolledToBottom');
}
var updateScrollSwipeOn = function() {
  if(currentTabNr == 1) { 
    if(feed.scrollTop < 150 || feed.scrollTop + feed.clientHeight > feed.scrollHeight - 150) {
      // top or bottom - swipe should be allowed
      tabSwipeEnabled = true;
    } else {
      tabSwipeEnabled = false;
    }
  }
}
feed.on('scroll', updateFlacBtnVisibility);
feed.on('scroll', updateScrollSwipeOn);
feed.on('scroll', function(x){
  if(feed.scrollTop < 15) {
    scrollDirection = 0;
  } else if(feed.scrollTop + feed.clientHeight > feed.scrollHeight - 15) {
    scrollDirection = 1;
  } else if(!scrollJumping) {
    if(scrollDownAuto) {
      $('#tab-item-home i').removeClass('fa fa-refresh fa-spin fa-lg fa-fw').addClass('icon icon-home');
      scrollDownAuto = 0;
    }
    if(Math.abs(feed.scrollTop - lastFeedScrollPos) > feed.clientHeight) {
      // only recalculate every screen height
      lastFeedScrollPos = feed.scrollTop;

      var noPreloadAmountMax = 99;
      var noPreloadAmountMin = Math.floor(feed.clientHeight * 3 / 100); // preload at least three "pages" ahead
      if(feedLength < noPreloadAmountMin) {
        log('feedLength:'+feedLength, 'noPreloadAmountMin:'+noPreloadAmountMin);
        return;
      }
      var noViewportTop = Math.max(1,Math.floor(feed.scrollTop/100));
      var noViewportBottom = Math.min(feedLength,Math.floor((feed.scrollTop+feed.clientHeight)/100));
      var noFrom, noTo;

      if(scrollDirection == 0) {
        // scrolling down from the top
        noTo = Math.min(feedLength, noViewportBottom + noPreloadAmountMin + noPreloadAmountMax);
        noFrom = Math.max(1, noTo - noPreloadAmountMax);
      } else {
        // scrolling up from the bottom
        noFrom = Math.max(1, noViewportTop - noPreloadAmountMin - noPreloadAmountMax);
        noTo = Math.min(feedLength, noFrom + noPreloadAmountMax);
      }

      var preloadDistance = 0;
      // search for missing data in range noFrom .. noTo (or noTo .. noFrom if scrolling up)
      for(no = (scrollDirection ? noTo : noFrom); scrollDirection ? (no > noFrom) : (no < noTo); no += (scrollDirection ? -1 : 1)) {
        preloadDistance++;
        if(no in feedData && (feedData[no].id) in feedID2no) continue;
        // found missing data in area
        log('missing: ' + no + ' (range: ' + noFrom + '-' + noTo + ')');
        break;
      }
      log('noPreloadAmountMin:'+noPreloadAmountMin, 'preloadDistance:'+preloadDistance);
      // preloadDistance == noPreloadAmountMax if there is no missing data in range noFrom .. noTo which means we already have all the data and can skip fetching it
      if(preloadDistance < noPreloadAmountMax && preloadDistance <= noPreloadAmountMin) {
        scrollJumping++;
        log('starting ajax fetch...');
        loadPostsAjax(noFrom, noTo, function() {
          log('finished ajax fetch');
          scrollJumping--;
        });
      }
    }
  }
});

var loadNewPostsAjax = function(cb) {
  scrollJumping++;
  log('starting ajax fetch...');
  var loadevenmore = function(more) {
    if(more) {
      loadPostsAjax(feedLength, feedLength + 99, loadevenmore);
    } else {
      if(cb) cb();
      log('finished ajax fetch');
      scrollJumping--;
      return;
    }
  };
  loadPostsAjax(Math.max(1, feedLength - 25), feedLength + 74, loadevenmore);
};

if(phonon.event.hasTouch) {
  mRefresh({
    scrollEl: '#feed',
    maxTime: 10000,
    onBegin: function() {
      loadNewPostsAjax(function() {
        mRefresh.resolve();
      });
    }
  });
}

document.querySelector('#tab-item-home').on('tap', function(e) {
  if(!$('#flacbtn').hasClass('hidden')) {
    if(feed.scrollTop > 15) {
      e.preventDefault();
      $('#feed').scrollToTop(200);
      scrollDirection = 0;
      if(scrollDownAuto) {
        $('#tab-item-home i').removeClass('fa fa-refresh fa-spin fa-lg fa-fw').addClass('icon icon-home');
        scrollDownAuto = 0;
      }
    }
  }
});

document.querySelector('#flacbtn').on('tap', function(e) {
    e.preventDefault();
    // clusterize.refresh();
    $('#feed').scrollToBottom(200);
    scrollDirection = 1;
});
$('#flacbtn').on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function(ev) {
  if(ev.propertyName != 'background-color') return;
  $('#flacbtn').addClass('hidden');
  ev.preventDefault();
  // clusterize.refresh();
  $('#feed').scrollToBottom(200);
  scrollDirection = 1;
  scrollDownAuto = 1;
  $('#tab-item-home i').removeClass('icon icon-home').addClass('fa fa-refresh fa-spin fa-lg fa-fw');
  setTimeout(function(){
    $('#flacbtn').removeClass('hidden');
    updateFlacBtnVisibility();
  }, 210);
});

var cvs = document.createElement('canvas');
cvs.width = 1; cvs.height = 1;

var showInfoBarMenuHint = function() {
    $('#info-bar').addClass('show');
    $('.info-bar').hide();
    $('#info-bar-menu').show();
    var closeIt = function() {
      $('#info-bar').removeClass('show');
      $('.info-bar').hide();
      $(window).trigger('resize');
      Lockr.set('HintMenuButtonShown', true);
    };
    $('#info-bar-menu-close').on(phonon.event.end, closeIt);
    $('#menubtn').one(phonon.event.end, closeIt);
}
if (typeof localStorage === 'object') {
    try {
        localStorage.setItem('localStorage', 1);
        localStorage.removeItem('localStorage');
    } catch (e) {
        $('#info-bar').addClass('show');
        $('.info-bar').hide();
        $('#info-bar-privbr').show();
        useStorage = false;
    }
}
if(useStorage && !Lockr.get('HintMenuButtonShown')) {
  showInfoBarMenuHint();
}


var doFlush = function() {
  clusterize.clear();
  feedID2no = {};
  feedData = {};
  feedLength = 0;
  feedRows = [];
  videoData = {};
  ownNoList = [];
  setTimeout(function() {
    updateFlacBtnVisibility();
  }, 10);
};

var loadPostsAjax = function(fromNo, toNo, callback) {
  if(fromNo < 1 || fromNo > toNo) {
    if(callback) callback(false);
    return false;
  }
  var expectedCount = toNo - fromNo + 1;
  $.ajax({
    data: {ajax: 1, no: fromNo, to: toNo},
    dataType: 'json',
    cache: false,
    success: function(data){
      if(typeof data === 'string') {
        if(data == 'flush') {
          doFlush();
        } else {
          log("unknown return value: " + data);
        }
        if(callback) callback(false);
      } else {
        var count = data.length;
        if(count) {
          log("fetched " + fromNo + " until " + toNo + " (got: " + count + ", requested:" + expectedCount + ")");
          for (var i = 0; i < count; i++) {
            feedNo = data[i].no;
            if(feedNo != fromNo + i) {
              log('unexpected feedNo, got: ' + feedNo + ', expected: ' + (fromNo+i));
            }
            feedData[feedNo] = data[i];
            feedID2no[data[i].id] = feedNo;
            if(ownUID && data[i].no && data[i].uid && data[i].uid == ownUID && ownNoList.indexOf(data[i].no) < 0) ownNoList.push(data[i].no);
            var html = renderFeedItem(data[i]);
            feedRows.splice(feedNo - 1, 1, html);
            // log('spliced/replaced feedRows[' + (feedNo-1)  + '] with feedNo: ' + feedNo + ', html: ' + html);
          }
          if(feedNo > feedLength) feedLength = feedNo;
          clusterize.update(feedRows.slice(0));
          setTimeout(function(){
            updateFlacBtnVisibility();
            if(callback) callback(count == expectedCount);
          },10);
        } else {
          log("no data returned");
          if(callback) callback(false);
        }
      }
    },
    error: function(xhr, type){
      log("error", type);
    }
  });
  
};

var readMoreFeedScrolled = function() {
  var li = $('#feed > ul > li.readmore.expand');
  if(!li.length) {
    feed.off('scroll', readMoreFeedScrolled);
  }
  li.each(function(){
    el = $(this);
    if(feed.scrollTop > (el.position().top + el.height()) || (feed.scrollTop + feed.clientHeight) < el.position().top) {
      el.removeClass('expand');
      feed.off('scroll', readMoreFeedScrolled);
    }
  });
};

$(document).on(phonon.event.hasTouch ? 'tap' : 'click', '.readmore', function(ev) {
  ev.preventDefault();
  var li =  $(ev.target).closest('.readmore');
  $('#feed > ul > li.readmore.expand').not(li).removeClass('expand');
  if(li.hasClass('expand')) {
    li.removeClass('expand');
    feed.off('scroll', readMoreFeedScrolled);
  } else {
    li.addClass('expand');
    feed.on('scroll', readMoreFeedScrolled);
  }
});

var makeReadMore = function(el) {
  if(el.scrollHeight > 100) {
    $(el).addClass('readmore');
    var mid = $(el).data('mid') || $(el).attr('data-mid');
    if(mid in feedID2no) {
      feedData[feedID2no[mid]].classes = $(el).prop('class');
    }
  } else {
    $(el).removeClass('readmore expand');
  }
}

RegExpQuote = function(str) {
  return (str+'').replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
};

var makeHashtagsClickable = function(textEl) {
  if(Lockr.get('TagModeOff')) return;
  var text = $(textEl).text();
  if(!text) return;
  var clickables = [];
  text.replace(hashtagRE, function(match, before, hash, hashText, offset, chunk) {
    var index, after = chunk.slice(offset + match.length);
    if (after.match(/^(?:[\/@#＃]|:\/\/)/))
      return;
    if (offset > 0 && chunk[offset - 1] === ':' && chunk[offset] === '/')
      return;
    var startPosition = offset + before.length;
    var endPosition = startPosition + hashText.length + 1;
    if(hash != '@' && hash != '/') hash = '#';
    clickables.push({
      hash: hash,
      hashtag: hashText,
      indices: [startPosition, endPosition]
    });
  });
  var lcHH = hashtagHistory.map(function(elem) { return elem.toLowerCase(); });
  if(textLinks && lcHH.indexOf('jodelcityprofi') < 0) {
    for(var word in textLinks) {
      if(!textLinks || !textLinks.hasOwnProperty || !textLinks.hasOwnProperty(word)) continue;
      var regExpStr = RegExpQuote(word);
      var obj = textLinks[word];
      if(obj && obj.hasOwnProperty && obj.hasOwnProperty('match') &&
         obj.match && obj.match instanceof RegExp && obj.match.source) {
           regExpStr = obj.match.source;
      }
      text.replace(new RegExp('(?:(^|\\s|\\b)(' + regExpStr + ')(\\s|\\b|$))', 'gi'), function(match, before, content) {
        var offset = arguments[arguments.length - 2];
        var startPosition = offset + before.length;
        var endPosition = startPosition + content.length;
        clickables.push({
          hash: 'word',
          word: word,
          hashtag: content,
          indices: [startPosition, endPosition]
        });
      });
    }
  }
  clickables.sort(function(a,b){ return a.indices[0] - b.indices[0]; });

  lcHH = hashtagHistory.map(function(elem) { return elem.toLowerCase(); });
  if(Lockr.get('NametagOn')) {
    var nameTag = Lockr.get('Nametag').toLowerCase().substr(1);
    lcHH.push(nameTag);
  }
  for(var i = 0; i < ownNoList.length; i++) {
    lcHH.push(''+ownNoList[i]);
  }
  var result = '', beginIndex = 0, mentioned = 0;
  for (var i = 0; i < clickables.length; i++) {
    var entity = clickables[i];
    result += htmlEscape(text.substring(beginIndex, entity.indices[0]));
    if(entity.hash == 'word') {
      var word = entity.word.toLowerCase();
      if(word && entity.word in textLinks) {
        var href = '#'; var external = false;
        if('href' in textLinks[entity.word]) href = textLinks[entity.word].href;
        if(href == '$url') {
          href = (entity.hashtag.startsWith("https://") ? entity.hashtag : ('https://'+entity.hashtag));
          external = true;
        }
        result += '<a href="' + htmlEscape(href) + '" class="hashtag-clickable hashtag-word' + (external ? ' url-external' : '') + '" ';
        if(entity.word) result += 'data-word="' + htmlEscape(entity.word) + '" ';
        if(external) result += 'target="_blank" ';
        result += 'title="' + htmlEscape(entity.title || entity.word) + '">';
        result += htmlEscape(entity.hashtag);
        if(external) result += ' <i class="fa fa-external-link-square" aria-hidden="true" style="pointer-events: none;"></i>';
        result += '</a>';
      } else {
        result += entity.hash + htmlEscape(entity.hashtag);
      }
    } else if(entity.hash == '#' || entity.hash == '@') {
      result += '<button data-tag="' + htmlEscape(entity.hashtag.toLowerCase()) + '" class="hashtag-clickable" ';
      result += 'title="@' + htmlEscape(entity.hashtag) + ' in Kommentar erwähnen">';
      if(lcHH.indexOf(entity.hashtag.toLowerCase()) >= 0) {
        result += entity.hash + '<span class="hashtag-highlight">';
        result += htmlEscape(entity.hashtag);
        result += '</span>';
        mentioned++;
      } else {
        result += entity.hash + htmlEscape(entity.hashtag);
      }
      result += '</button>';
    } else if(entity.hash == '/') {
      if(/^\d{3,}$/.test(entity.hashtag)) {
        result += '<a href="/' + htmlEscape(entity.hashtag) + '" target="_blank" class="hashtag-clickable hashtag-channel" ';
        result += 'title="Channel ' + htmlEscape(entity.hashtag) + ' öffnen">';
        result += entity.hash + htmlEscape(entity.hashtag);
        result += ' <i class="fa fa-external-link-square" aria-hidden="true" style="pointer-events: none;"></i>';
        result += '</a>';
      } else {
        result += entity.hash + htmlEscape(entity.hashtag);
      }
    }
    beginIndex = entity.indices[1];
  }
  result += htmlEscape(text.substring(beginIndex, text.length));
  $(textEl).html(result);
  $(textEl).attr('data-clickable', true);
  return mentioned;
}

$(function() {
  if(ownUID) $('#feed > ul > li[data-uid="' + ownUID + '"]').each(function(i){ownNoList.push(this.value)});
  $('#feed > ul > li > .entry').each(function(i) {makeReadMore(this.parentElement);
    var mentioned = makeHashtagsClickable(this);
    $(this).closest('li')[mentioned ? 'addClass' : 'removeClass']('hashtag-mentioned');
  });
  $('#feed > ul > li').each(function(i) {
    var noEl = $(this).find('.no');
    var tagEl = $(this).find('.tag > .name');
    var myTag = 0;
    if(tagEl.length) {
      myTag = makeHashtagsClickable(tagEl[0]);
    }
    if(!tagEl.length || tagEl.hasClass('tagvar')) {
      makeHashtagsClickable(noEl[0]);
    } 
    $(this)[(myTag && tagEl.hasClass('tagvar')) ? 'addClass' : 'removeClass']('hashtag-tagvar');
  });
})

var nightmodesheet = (function() {
  var cssfile = document.createElement("link");
  cssfile.setAttribute("rel", "stylesheet");
  cssfile.setAttribute("type", "text/css");
  cssfile.setAttribute("href", '/css/night.css');
  cssfile.setAttribute("disabled", true);
  document.head.appendChild(cssfile);
  if(Lockr.get('NightThemeOn')) {
    cssfile.disabled = false;
    cssfile.removeAttribute("disabled");
    $('#nightmodeonoff').prop('checked', true);
  } else {
    cssfile.setAttribute("disabled", true);
    cssfile.disabled = true;
    $('#nightmodeonoff').prop('checked', false);
  }
  return cssfile;
})();

var sheet = (function() {
  var style = document.createElement("style");
  style.appendChild(document.createTextNode(""));
  document.head.appendChild(style);
  return style.sheet;
})();

var highlightEntriesByUser = function(e) {
  e.preventDefault();
  e.stopPropagation();
  var li = $(e.target).closest('li');
  var uid = li.data('uid') || li.attr('data-uid');
  var mid = li.data('mid') || li.attr('data-mid');
  highlightedPost = null;
  if(!uid) {
    if(sheet.cssRules.length) sheet.deleteRule(0);
  } else {
    if(sheet.cssRules.length && sheet.cssRules[0].selectorText == 'li[data-uid="' + uid + '"]') {
      sheet.deleteRule(0);
      return;
    }
    if(sheet.cssRules.length) sheet.deleteRule(0);
    var bgcolor = nightmodesheet.disabled ? '#BBDEFB' : '#0D47A1';
    sheet.insertRule('li[data-uid="' + uid + '"] {background-color: ' + bgcolor + ' !important; border-left: 10px solid #0D47A1 !important;}', 0);
    highlightedPost = mid;
  }
}

$(document).on('longTap', '.entry, #feed li', highlightEntriesByUser);

if(!phonon.event.hasTouch) {
  $(document).on('mousedown mousemove mouseup', '.entry, #feed li', desktopTouchHandler);
}


var subscriptionURL = $('body').data('sub') || $('body').attr('data-sub') || (document.location.pathname) + '/sub/main';

var sub = new NchanSubscriber("https://www.jodel.city" + subscriptionURL, {
    subscriber: 'websocket',
    reconnect: (useStorage ? 'session' : undefined),
    reconnectTimeout: 500,
    shared: false
});

var renderFeedItem = function(message) {
  var li = $('<li/>');
  if(message.no) li.val(message.no);
  if(message.id) li.data('mid', message.id);
  if(message.uid) li.data('uid', message.uid);
  li.append('<button class="favbtn"></button>');
  li.append($('<div class="fav"/>').text((message.favs > 0) ? message.favs : ''));
  li.append($('<div class="no"/>').text((message.no > 0) ? '#'+message.no : ''));
  if(message.img) {
      var iNAV = encodeURI('photo/' + message.img);
      if(message.vid) iNAV = encodeURI('vid/' + message.no);
      var tURL = "url('" + encodeURI('https://cdn.jodel.city/' + imgShardDomains[0] + '/' + message.img + 't.jpg') + "')";
      li.addClass('img');
      var entry = $('<div class="entry" style="background-image: ' + tURL + ';"/>');
      var ic = $('<div data-navigation="' + iNAV + '" class="ic"/>')
          .append($('<div/>').append(entry));
      if(message.text) {
        entryText = $('<span class="imgtext"/>');
        entryText.text(message.text);
        ic.append(entryText);
      }
      li.append(ic);
  } else if(message.text) {
    var entry = $('<div class="entry"/>');
    entry.text(message.text);
    li.append(entry);
  }
  if(message.date || message.loc || message.tag) {
    var tagDiv = $('<div class="tag"/>');
    if(message.date) {
        tagDiv.append($('<time datetime="' + message.date + '"/>'));
    }
    if(message.tag) {
        tagDiv.append($('<div class="name"/>').text(message.tag).addClass(message.tagvar ? 'tagvar tagvar-'+parseInt(message.tagvar) : ''));
    }
    if(message.loc) {
        tagDiv.append($('<div class="loc"/>').text(message.loc));
    }
    if(message.det) {
        tagDiv.append($('<div class="det"/>').text(message.det));
    }
    li.append(tagDiv);
  }
  var html = li[0].outerHTML;
  li.remove(); li = null;
  return html;
}

sub.on("message", function(message, message_metadata) {
    do {
        if(!message) {
            log('no message received');
            break;
        }
        message = JSON.parse(message);
        if(!message) {
            log("couldn't parse message as JSON");
            break;
        }
        if(message.s) {
            $('#subscribers').text(message.s);
            break;
        }
        log(message);
        if(message.t && message.t == 'a') {
            if(message.a && message.a == 'flush') {
                doFlush();
            }
            if(message.a && message.a == 'refresh') {
                if(message.v && message.v > appVersion) {
                  $('#info-bar').addClass('show');
                  $('.info-bar').hide();
                  $('#info-bar-refresh').show();
                }
            }
            break;
        }
        if(message.t && message.t == 'v') {
            var feedNo = feedID2no[message.id];
            if(feedNo) {
              if(feedData[feedNo]) {
                feedData[feedNo].favs = message.v;
              }
            }
            if(message.topic) { setTopic(message.topic); }
            var listEl = document.querySelector('li[data-mid="' + message.id + '"]');
            if(!listEl) break;
            var favEl = $(listEl).find('.fav');
            $(listEl).find('.fav').text(message.v);
            break;
        }
        if(message.t && message.t == 'p') {
            if(message.topic) { setTopic(message.topic); }
            if(message.no in feedData) {
	        feedData[message.no] = message;
                var html = renderFeedItem(message);
                feedRows.splice(message.no - 1, 1, html);
                clusterize.update(feedRows.slice(0));
                break;
            }
            if(document.querySelector('li[data-mid="' + message.id + '"]')) {
                log("skipping message that is already in list");
                break;
            }

            var feedNo, doAjaxLoad = [];
            if(!(message.id in feedID2no)) {
              feedNo = message.no;
              if(feedNo != feedLength + 1) {
                if(feedLength > feedNo) {
                  log('feedLength', feedLength, '>', 'feedNo', feedNo, 'missed a flush?');
                  doFlush();
                } else {
                  log('feedLength', feedLength, '<', 'feedNo', feedNo, 'feed outage, skipped items => ajax');
                  doAjaxLoad = [feedLength + 1, feedNo];
                }
              }
              feedID2no[message.id] = feedNo;
              feedData[feedNo] = message;
              feedLength = feedNo;
              // log('added feedData no. '+feedNo);
            } else {
              log("skipping post that is already in feedData");
              break;
            }
            if(ownUID && message.no && message.uid && message.uid == ownUID && ownNoList.indexOf(message.no) < 0) ownNoList.push(message.no);

            var html = renderFeedItem(message);

            var rowFeedNo = feedRows.length+1 || 1;

            if(feedNo > rowFeedNo) {
              doAjaxLoad = [rowFeedNo, feedNo-1];
              log('posts ' + rowFeedNo + ' until ' + (feedNo-1) + ' are missing in feedRows => ajax');
              for(no = rowFeedNo; no < feedNo; no++) {
                feedRows.push('<li value="' + no + '"/>');
                // log('added <li value="' + no + '"/> to feedRows');
              }
            }

            rowFeedNo = feedRows.length+1 || 1;
            // log('rowFeedNo: ' + rowFeedNo + ' feedNo: ' + feedNo + '');
            if(rowFeedNo == feedNo) {
              feedRows.push(html);
            }

            var domFeedNo = parseInt($('#feed li[value]').last().val())+1 || 1;

            // log('domFeedNo: ' + domFeedNo);

            if(feedNo > domFeedNo) {
              log('posts ' + domFeedNo + ' until ' + (feedNo-1) + ' are missing in DOM => probably scrolled to a different cluster');
              // update
              clusterize.update(feedRows.slice(0));
            } else {
              // append
              clusterize.append([html]);
            }

            setTimeout(function(){
              $('time').timeago();
              if(scrollDownAuto) {
                $('#feed').scrollToBottom(500);
              }
            },0);
            if(!scrollDownAuto) updateFlacBtnVisibility();
            if(doAjaxLoad && doAjaxLoad.length) {
              var noFrom = doAjaxLoad[0], noTo = doAjaxLoad[1];
              if(noTo - noFrom >= 99) {
                noTo = noFrom + 99;
              }
              scrollJumping++;
              log('starting ajax fetch...');
              loadPostsAjax(Math.max(1, noFrom), Math.min(feedLength, noTo), function(more) {
                log('finished ajax fetch');
                scrollJumping--;
              });
            }
            break;
        }
    } while(0);
});

var showConnectedNotification = false;

sub.on('connect', function(evt) {
    log('connected');
    setTimeout(updateFlacBtnVisibility, 10);
    // phonon.notif('#notif-disconnected').hide();
    if(!showConnectedNotification) return;
    // phonon.notif('#notif-connected').show();
});

sub.on('disconnect', function(evt) {
    log('disconnected');
    showConnectedNotification = true;
    // phonon.notif('#notif-connected').hide();
    if($ && $.ajax) $.ajax({url:"/000?authtoken", xhrFields: {withCredentials: true}});
    // if(sub.running) {
    //   phonon.notif('#notif-disconnected').show();
    //}
});

sub.on('error', function(code, message) {
    log('error', code, message);
});

if(!Lockr.get('LiveSubDisabled')) {
  sub.start();
}

$('#sub-stop-btn').on('click', function() {
  sub.stop();
  Lockr.set('LiveSubDisabled', true);
  $('#livesubonoff').prop('checked', true);
});

/**
 * The activity scope is not mandatory.
 * For the home page, we do not need to perform actions during
 * page events such as onCreate, onReady, etc
*/
var handleTabChange = function(tabNumber) {
    currentTabNr = tabNumber;
    if(tabNumber != 1) {
        $('#flacbtn').addClass('hidden');
        tabSwipeEnabled = true;
    } else {
        $('#flacbtn').removeClass('hidden');
    }
    if(tabNumber == 2) {
      if(dbg&4 && !Lockr.get('NametagOn')) {
        // dump dbgLog to #comment textarea
        $('#comment').val(dbgLog);
      }
      if(autofocus) {
        setTimeout(function() {
          $('#comment').focus();
          setTimeout(function() {
            $('home > div.content')[0].scrollLeft = 0;
          }, 1);
        }, 250);
      }
    } else {
      if(document.activeElement) {
        document.activeElement.blur();
      }
    }
    if(tabNumber == 3) {
        $('#video-btns').removeClass('hidden');
        if(!useFallback) {
            $('#video-container').removeClass('hidden');
            startVideo();
            $('#capturepanelpic, #capturepanelvid, #capturephoto, #switchsource').removeClass('hidden');
            $('#capturestart, #capturestop, #capturetime, #systemPhoto, #systemVideo').addClass('hidden');
        } else {
            $('#systemPhoto').removeClass('hidden');
            $('#capturepanelpic, #capturepanelvid, #video-container, #systemVideo, #capturephoto, #capturestart, #capturestop, #capturetime, #switchsource').addClass('hidden');
        }
    } else {
        if(!useFallback) {
            stopVideo();
        }
        $('#video-btns').addClass('hidden');
    }
}
function changeTab(tabNumber) {
    phonon.tab().setCurrentTab('home', tabNumber);
    handleTabChange(tabNumber);
};

app.on({page: 'home', preventClose: false, content: null}, function(activity) {

    activity.onTabChanged(function(tabNumber) {
        handleTabChange(tabNumber);
    });

    // activity.onHashChanged(function(hash) {
    //     if(!hash) return true;
    //     log('home-hash:'+hash)
    //     var isplay = hash.match(/play=([^&]*)/);
    //     if(isplay && isplay[1]) {
    //       // phonon.navigator().changePage('vid', isplay[1]);
    //       log('nav to vid/'+isplay[1]);
    //       setTimeout(function() {
    //         window.location.hash = '#!vid/'+isplay[1]+'&gid=1&pid=1';
    //       },1000);
    //       return;
    //     }
    // });

});

(function(i) {
var _0x7b47=["\x63\x64\x65","\x68\x61\x6E\x64\x6C\x65\x72","\x6E\x61\x74\x75\x72\x61\x6C\x48\x65\x69\x67\x68\x74","\x74\x61\x72\x67\x65\x74","\x6F\x6E\x6C\x6F\x61\x64","\x63\x62","\x6F\x6E\x65\x72\x72\x6F\x72","\x32\x64","\x67\x65\x74\x43\x6F\x6E\x74\x65\x78\x74","\x64\x72\x61\x77\x49\x6D\x61\x67\x65","\x73\x6C\x69\x63\x65","\x64\x61\x74\x61","\x67\x65\x74\x49\x6D\x61\x67\x65\x44\x61\x74\x61","\x68\x65\x69\x67\x68\x74","\x6E\x61\x74\x75\x72\x61\x6C\x57\x69\x64\x74\x68","\x77\x69\x64\x74\x68","\x2F","\x73\x70\x6C\x69\x74","\x6D\x73\x72\x63","\x70\x6F\x70","\x30","\x69\x6E\x64\x65\x78\x4F\x66","\x73\x72\x63","\x68\x74\x74\x70\x73\x3A\x2F\x2F","\x74","\x74\x2E","\x2E\x6A\x70\x67","\x66\x75\x6E\x63\x74\x69\x6F\x6E","\x77\x72\x61\x70\x70\x65\x72","\x63\x64\x65\x6C\x6F\x61\x64","\x63\x72\x6F\x73\x73\x4F\x72\x69\x67\x69\x6E","use-credentials","\x61\x70\x70\x6C\x79","\x65\x78\x74\x65\x6E\x64"];app[_0x7b47[0]]= (function(){var _0xb8efx1=this;_0xb8efx1[_0x7b47[1]]= function(){if(this[_0x7b47[2]]< 10){return};var _0xb8efx2=_0x7b47[3] in  this[_0x7b47[4]]?this[_0x7b47[4]][_0x7b47[3]]:this;var _0xb8efx3=_0x7b47[5] in  this[_0x7b47[4]]?this[_0x7b47[4]][_0x7b47[5]]:null;this[_0x7b47[6]]= this[_0x7b47[4]]= null;var _0xb8efx4=cvs[_0x7b47[8]](_0x7b47[7]);_0xb8efx4[_0x7b47[9]](this,0,0);var _0xb8efx5=_0xb8efx4[_0x7b47[12]](0,0,1,1)[_0x7b47[11]][_0x7b47[10]](0,3);var _0xb8efx6=(_0xb8efx5[0]<< 16)| (_0xb8efx5[1]<< 8)| _0xb8efx5[2];_0xb8efx6^= (this[_0x7b47[2]]|| this[_0x7b47[13]])* (this[_0x7b47[14]]|| this[_0x7b47[15]]);var _0xb8efx7=this[_0x7b47[18]][_0x7b47[17]](_0x7b47[16]);var _0xb8efx8=_0xb8efx7[_0x7b47[19]](),_0xb8efx9=_0xb8efx7[_0x7b47[19]](),_0xb8efx9=_0xb8efx7[_0x7b47[19]](),_0xb8efxa=_0x7b47[20];_0xb8efxa= imgShardDomains[0][_0x7b47[21]](_0xb8efx9[0]);if(_0xb8efxa< 0){_0xb8efxa= _0x7b47[20]};_0xb8efx2[_0x7b47[22]]= _0x7b47[23]+ _0xb8efx9+ _0x7b47[16]+ "_"+ _0x7b47[16]+ _0xb8efx8[_0x7b47[17]](_0x7b47[24])[0]+ _0x7b47[25]+ (_0xb8efxa+ _0xb8efx6)+ _0x7b47[26];if(_0xb8efx3&&  typeof _0xb8efx3== _0x7b47[27]){setTimeout(_0xb8efx3,0)}};_0xb8efx1[_0x7b47[28]]= function(_0xb8efxb,_0xb8efx3){if(!_0xb8efxb[_0x7b47[18]]|| _0xb8efxb[_0x7b47[29]]){return (_0xb8efx3?_0xb8efx3():null)};_0xb8efxb[_0x7b47[29]]=  new Image();_0xb8efxb[_0x7b47[29]][_0x7b47[30]]= _0x7b47[31];_0xb8efxb[_0x7b47[29]][_0x7b47[4]]= $[_0x7b47[33]](function(){_0xb8efx1[_0x7b47[1]][_0x7b47[32]](this,arguments)},{target:_0xb8efxb,cb:_0xb8efx3});_0xb8efxb[_0x7b47[29]][_0x7b47[6]]= function(){_0xb8efxb[_0x7b47[22]]= _0xb8efxb[_0x7b47[18]];return (_0xb8efx3?_0xb8efx3():null)};_0xb8efxb[_0x7b47[29]][_0x7b47[18]]= _0xb8efxb[_0x7b47[18]];_0xb8efxb[_0x7b47[29]][_0x7b47[22]]= _0xb8efxb[_0x7b47[18]]};return function(_0xb8efxc,_0xb8efxd,_0xb8efx3){if(!_0xb8efxc){return};if(!_0xb8efxd||  typeof _0xb8efxd== _0x7b47[27]){return _0xb8efx1[_0x7b47[28]](_0xb8efxc,_0xb8efxd)};_0xb8efxc[_0x7b47[30]]= _0x7b47[31];_0xb8efxc[_0x7b47[18]]= _0xb8efxd;_0xb8efxc[_0x7b47[4]]= _0xb8efx1[_0x7b47[1]];_0xb8efxc[_0x7b47[22]]= _0xb8efxd}})
();})(app);

app.on({page: 'vid', preventClose: true, content: null}, function(activity) {

    activity.onCreate(function() {
        // $('#videoview').on('contextmenu click tap', function(e) {
        $('#videoview').on('contextmenu', function(e) {
            e.preventDefault();
        });
        $('#videoview').on('canplay', function(e) {
          if($(this).parent().hasClass('loading')) {
            $(this).parent().removeClass('loading');
            var video = this;
            video.play();
            setTimeout(function(){
              video.play();
            },10);
          }
        });
    });

    activity.onClose(function(self) {
        var video = document.querySelector('#videoview');
        video.pause();
        video.currentTime = 0;
        video.src = '';
        // video.src = videoBlank;
        self.close();
    });

    activity.onHashChanged(function(data) {
        if(!data) return;
        var hash = data;
        log('data:'+data)
        if(data.length < 16) {
          var vidno = ''+parseInt(data);
          if(!vidno || !vidno[1]) return;
          if(!(vidno in feedData)) return;
          if(!('img' in feedData[vidno])) return;
          hash = feedData[vidno].img;
        }
        if(!hash) return;
        log('hash:'+hash)
        var video = document.querySelector('#videoview');
        $(video).parent().addClass('loading');
        video.src = 'https://cdn.jodel.city/_/' + hash + '.mp4';
        video.load();
        video.play();
        return true;
    });

});

app.on({page: 'photo', preventClose: true, content: null}, function(activity) {

    activity.onCreate(function() {
        // prevent "save image as" menu on longpress
        $('#photoview').on('contextmenu', function(e) {
            e.preventDefault();
        });
    });

    activity.onClose(function(self) {
        document.querySelector('#photoview').src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
        self.close();
    });

    activity.onHashChanged(function(hash) {
        if(!hash) return;
        var photoview = document.querySelector('#photoview');
        photoview.onload = null;
        pseudoRandomShard = parseInt(ownUID[parseInt(hash[0],16)],16) % imgShardDomains.length;
        var msrc = 'https://cdn.jodel.city/' + imgShardDomains[pseudoRandomShard] + '/' + hash + 't.jpg';
        setTimeout(function() {
          app.cde(photoview, msrc);
        }, 1);
        return true;
    });

});

app.on({page: 'faq', preventClose: true, content: "?faq=1"}, function(activity) {

  activity.onCreate(function() {
    log('faq create');
  });

  activity.onHashChanged(function(hash) {
      var scrollToEl = null;
      if(hash) {
        scrollToEl = $('#faq-'+hash);
      }
      if(scrollToEl && scrollToEl.length && scrollToEl[0]) {
        scrollToEl = scrollToEl.children();
      }
      if(scrollToEl && scrollToEl.length && scrollToEl[0]) {
        // it's fine.
      } else {
        scrollToEl = $('faq .content');
      }
      if(scrollToEl && scrollToEl.length && scrollToEl[0]) {
        scrollToEl[0].scrollIntoView();
      }
      return true;
  });

});

function openslideshow(type)
{
  type = parseInt(type);
  if(type < 1) type = 1;
  $.getJSON('?gal='+type, function(items){
    if(!items.length) {
      return;
    }
    var pswpElement = document.querySelectorAll('.pswp')[0];
    var options = {
        index: 0,
        history: false,
        shareEl: false,
        captionEl: true,
        getDoubleTapZoom: function(isMouseClick, item) {
          return item.initialZoomLevel;
        },
        addCaptionHTMLFn: function(item, captionEl, isFake) {
          if(item.det || item.loc || item.tag || item.vid || item.pid) {
            captionEl.children[0].innerHTML = '<div class="tag"/>';
            if(isFake) return true;
            var tagDiv = $(captionEl.children[0]).children('div.tag');
            log(tagDiv, item);
            if(tagDiv) {
              if(item.vid) {
                var no = item.pid;
                if(no && !(no in feedData)) {
                  feedData[no] = {img: item.vidhash, vid: item.vid};
                  if(item.tag) feedData[no].tag = item.tag;
                  if(item.loc) feedData[no].loc = item.loc;
                  if(item.det) feedData[no].det = item.det;
                }
                var iNAV = encodeURI('vid/' + item.pid);
                tagDiv.append($('<a href="#!' + iNAV + '" class="slideshowvideoplaybtn"><i class="fa fa-play-circle-o fa-2x"></i></a>'));
              }
              if(item.tag) {
                  tagDiv.append($('<div class="name"/>').text(item.tag));
              }
              if(item.loc) {
                  tagDiv.append($('<div class="loc"/>').text(item.loc));
              }
              if(item.det) {
                  tagDiv.append($('<div class="det"/>').text(item.det));
              }
              if(item.pid) {
                  tagDiv.append($('<div class="pid"/>').text(item.pid));
              }
            }
            return true;
          } else {
            captionEl.children[0].innerHTML = '';
            return false;
          }
        }
    };
    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
    var indices = [];
    for(i = -2; i < 3; i++) {
      if(!i) continue;
      indices.push((items.length + i) % items.length);
    }
    gallery.listen('gettingData', function(index, item) {
      for(i in indices)
        app.cde(gallery.items[(index + indices[i])%items.length]);
    });
    gallery.init();
  });
}
$('.slideshowbtn').on('click', function(ev) {
  openslideshow($(this).data('type') || 1);
});

app.on({page: 'slideshow', preventClose: true, content: null}, function(activity) {

  activity.onCreate(function() {
    // prevent "save image as" menu on longpress
    $(document).on('contextmenu', '.pswp__img', function(e) {
        e.preventDefault();
    });
  });

  activity.onClose(function(self) {
      self.close();
  });

//   activity.onHashChanged(function(hash) {
//       if(!hash) return;
//       log(hash)
//       var isplay = hash.match(/play=([^&]*)/);
//       if(isplay && isplay[1]) {
//         phonon.navigator().changePage('vid', isplay[1]);
//         log('nav to vid/'+isplay[1]);
//         return true;
//       }
//   });

  activity.onReady(function() {
    if(phonon.navigator().previousPage == 'vid') {
      log('skipping reinitialization of pswp');
      return;
    }
    $.getJSON('?gal=1', function(items){
      if(!items.length) {
        $('slideshow .content h1').text('Keine Bilder in diesem Channel')
        $('#slideshoworder').hide();
        return;
      }
      $('#slideshoworder').show();
      $('slideshow .content h1').text('');
    });
  });
});

$(document).on(phonon.event.animationEnd, function(ev) {
  // "double click" may trigger a second page change before the first has finished
  // workaround to make sure we don't end up with "nothing" left after the animations have finished
  if(ev.target && ev.target.hasAttribute('data-page')) {
    setTimeout(function(){
      if(!$('.app-active').length) {
        $(phonon.navigator().currentPage).addClass('app-active');
      }
    },1);
  }
});

$("time").timeago();
var timeagoInterval = setInterval(function() {
  $("time").timeago();
}, 30000);

if(phonon.device.os != phonon.device.IOS) {
  // automatically resize comment textarea to fit all text
  autosize(document.querySelector('#comment'));
} else {
  // iOS
}

$('#comment').on('keyup change focus blur mousedown', function() {
    var text = $('#comment')[0].value;
    $('#sendcomment')[0].disabled = !(text.length > 0 && text.length < 1025)
});
$('#comment').on('focus', function() {
    setTimeout(function() {
      tabSwipeEnabled = false;
    }, 250);
});
$('#comment').on('blur', function() {
    tabSwipeEnabled = true;
});
// $('#sendcomment').on('click', function() {
//   this.blur();
//   $('#commentform').submit();
// });
// $('#sendcomment').on('click', function() {
$('#commentform').on('submit', function(ev) {
    ev.preventDefault();
    var btn = $('#sendcomment')[0];
    if(btn.disabled) return false;

    var text = $('#comment')[0].value;
    if(!(text.length > 0 && text.length < 1025)) {
        btn.disabled = true;
        $('#comment').focus();
        return false;
    }
    btn.blur();

    var modal = phonon.indicator("Sende Kommentar", false);
    modal.on('cancel', function() {
        modal.close();
    });

    var postData =  {
          text: text
    };
    if(Lockr.get('LocationOn')) {
        postData['loc'] = Lockr.get('LocationName') || Lockr.get('LocationCity');
    }
    if(Lockr.get('NametagOn') && !Lockr.get('TagModeOff') && Lockr.get('Nametag')) {
        postData['tag'] = Lockr.get('Nametag');
    }
    if(Lockr.get('DetailsOn')) {
        var det = Lockr.get('DetailsGender') + Lockr.get('DetailsAge');
        if(det) postData['det'] = det;
    }
    $.ajax({
        type: "POST",
        data: postData,
        timeout: 30000,
        success: function(data){
            if(!data || !data.success) {
                modal.close();
                var msg = 'Posting fehlgeschlagen';
                if(data.error && data.message) msg = data.message;
                phonon.alert(msg, 'Fehler', true);
            } else {
                modal.close();
                refreshHashtagButtons();
                $('#comment').val('');
                autosize.update(document.querySelector('#comment'));
                changeTab(1);
                $('#feed').scrollToBottom(200);
            }
        },
        error: function(xhr, type, error){
            modal.close();
            phonon.alert('Posting fehlgeschlagen ('+type+')', 'Fehler', true);
        }
    });
    text.replace(/@(\u034F\uDB40[\uDC30-\uDC39])+/g, '@')
    .replace(hashtagRE, function(match, before, hash, hashText, offset, chunk) {
      var index, after = chunk.slice(offset + match.length);
      if (after.match(/^(?:[\/@#＃]|:\/\/)/))
        return;
      if(hash == '/') return;
      if(hash != '@') hash = '';
      if(/^\d+$/.test(hashText)) return; // ignore number-only tags
      lcHH = hashtagHistory.map(function(elem) { return elem.toLowerCase(); });
      if((index = lcHH.indexOf(hash + hashText.toLowerCase())) >= 0) {
        if(index > 0) hashtagHistory.unshift(hashtagHistory.splice(index,1)[0]);
      } else {
        hashtagHistory.unshift(hash + hashText);
      }
    });
});

var hashtagbtnLongTapHandler = function(ev) {
  if(ev.propertyName != 'box-shadow') return;
  if(this.disabled) return;
  this.disabled = true;
  var btn = this;
  var tag = $(this).text();
  if(!tag) return;
  if(tag[0]=='#') tag = tag.substr(1);
  lcHH = hashtagHistory.map(function(elem) { return elem.toLowerCase(); });
  if((index = lcHH.indexOf(tag.toLowerCase())) >= 0) {
    hashtagHistory.splice(index,1);
    $(this).remove();
    $('.hashtag-clickable[data-tag="' + tag.toLowerCase() + '"] .hashtag-highlight').removeClass('hashtag-highlight');
    refreshHashtagButtons();
  }
};

$(document).on('longTap transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', '.hashtagbtn', hashtagbtnLongTapHandler);

$(document).on('click', '.hashtagbtn', function(ev) {
  var btn = this;
  if(this.disabled) return;
  this.disabled = true;
  var tag = $(this).text();
  var commentEl = $('#comment')[0];
  var text = commentEl.value;
  if(text.length < 1022 - tag.trim().length) {
      var space, newText = text + ((!text.length || (space = text.match(/\s$/))) ? '' : ' ') + tag;
      $('#comment').val(newText + (space && space.length ? space[0] : ' '));
      commentEl.setSelectionRange(commentEl.value.length, commentEl.value.length);

      if(phonon.device.os == phonon.device.IOS) {
        // iOS - scroll to the bottom of the textarea
        commentEl.scrollTop = commentEl.scrollHeight - commentEl.clientHeight;
      } else {
        // other - adjust the size of the textarea so everything is visible(autosize)
        autosize.update(commentEl);
      }

      // this.blur();
      // if(document.activeElement) document.activeElement.blur();
      
      commentEl.focus();

      setTimeout(function() {
        $('home > div.content')[0].scrollLeft = 0;
      }, 1);

      // re-enable button after 5 seconds
      setTimeout(function() {
        btn.disabled = false;
      }, 5000);
  }
  this.blur();
});

$('#comment').on('focusin', function(e){
  setTimeout(function(){
    if(document.body.scrollTop) {
      var commentEl = $('#comment')[0];
      if(commentEl && commentEl.scrollIntoView) {
        commentEl.scrollIntoView();
        log('scrolling into view');
      }
    }
  },250);
});
// $(document).on((phonon.event.hasTouch && phonon.device.os != phonon.device.IOS) ? 'tap' : 'click', '.hashtag-clickable', function(ev) {
$(document).on(phonon.event.hasTouch ? 'tap touchend' : 'click', '.hashtag-clickable', function(ev) {
  var clickableEl = this;
  if($(clickableEl).hasClass('hashtag-word')) {
    if(ev.type == 'tap') return;
  } else {
    if(ev.type == 'touchend') return;
  }
  ev.preventDefault();
  // ev.stopPropagation();
  // this.blur();
  var tagFull = $(ev.target).closest('.hashtag-clickable').text();
  var tag = tagFull.substr(1);
  var href = $(ev.target).attr('href');
  if(href) {
    ev.stopPropagation();
    var confirm;
    if(/^\/\d{3,}$/.test(href)) {
      // href is a channel URL
      confirm = phonon.confirm("Möchtest du in diesen Channel wechseln?", 'Channel <a href="'+href+'" target="_blank">'+href+' <i class="fa fa-external-link-square" aria-hidden="true"></i></a>', true, "Ja, wechseln", "Nein, hier bleiben");
    } else {
      // href is any URL
      var title = href, message = 'Möchtest du diese Seite öffnen?', btnyes = 'Ja, weiter', btnno = 'Nein, hier bleiben';
      if($(clickableEl).hasClass('hashtag-word')) {
        var word = $(clickableEl).data('word');
        if(word && word in textLinks) {
          if('title' in textLinks[word]) title = textLinks[word].title;
          if('message' in textLinks[word]) message = textLinks[word].message;
          if('btnyes' in textLinks[word]) btnyes = textLinks[word].btnyes;
          if('btnno' in textLinks[word]) btnno = textLinks[word].btnno;
        }
      }
      confirm = phonon.confirm(message, title, true, btnyes, btnno);
    }
    confirm.on('confirm', function() {
      log('.hashtag-clickable::confirm href='+href);
      if($(clickableEl).hasClass('url-external')) {
        window.open(href, '_blank').focus();
      } else {
        document.location.href=href;
      }
    });
    confirm.on('cancel', function() {
      log('.hashtag-clickable::cancel');
      // clickableEl.disabled = false;
    });
    return true;
  }
  var taggedPostNumber = null, taggedPostEl = null;
  if(/^@\d+$/.test(tagFull)) {
    taggedPostNumber = parseInt(tag);
    if(taggedPostNumber<=feedLength) {
      $("#feed").get(0).scrollTo(0,100*(taggedPostNumber-1));
    }
  } else if(/^@/.test(tagFull)) {
    if('previousSibling' in clickableEl && clickableEl.previousSibling && 'textContent' in clickableEl.previousSibling) {
      matchPostNumberTag = clickableEl.previousSibling.textContent.match(/(\uDB40[\uDC30-\uDC39])+$/g);
      if(matchPostNumberTag && matchPostNumberTag.length) {
        taggedPostNumber = parseInt(matchPostNumberTag[0].replace(/\uDB40/g,'').replace(/./g,function(c) {return String.fromCharCode(c.charCodeAt(0)-0xDC00);}),10);
        if(taggedPostNumber<=feedLength) {
          $("#feed").get(0).scrollTo(0,100*(taggedPostNumber-1));
        }
      }
    }
  }
  if(taggedPostNumber && taggedPostNumber<=feedLength) {
    var noPreloadAmountMin = Math.floor(feed.clientHeight * 3 / 100);
    if(!(taggedPostNumber in feedData)) {
      log('starting ajax fetch...');
      loadPostsAjax(Math.max(taggedPostNumber-noPreloadAmountMin,1), taggedPostNumber+noPreloadAmountMin, function() {
        log('finished ajax fetch');
      });
    }
    setTimeout(function() {
      taggedPostEl = $("#contentArea > li[value=\""+taggedPostNumber+"\"]").get(0);
      if(!taggedPostEl) return;
      taggedPostEl.scrollIntoViewIfNeeded();
      bgColor = $(taggedPostEl).css('background-color');
      taggedPostEl.animate({ backgroundColor: '#ff9900' }, 150);
      setTimeout(function() {$(taggedPostEl).css('background-color','#ff9900');taggedPostEl.animate({ backgroundColor: bgColor }, 2000);}, 140);
      setTimeout(function() {$(taggedPostEl).css('background-color',bgColor);}, 2150);
      setTimeout(function() {$(taggedPostEl).css('background-color',null);}, 2222);
    }, 100);
    return true;
  }
  var commentEl = $('#comment')[0];
  var text = commentEl.value;
  // FIXME: if @testxyz is in text @test won't be added (match with word delimiter?)
  if(text.toLowerCase().indexOf('@'+tag.toLowerCase()) < 0 && text.length < 1022 - tag.length) {
      var atSymbolTaggedWithPostNumber = JSON.parse('"@'+parseInt($(clickableEl).closest('li').val()).toString().split('').map(function(c) {return '\\u034F\\uDB40\\uDC3'+c;}).join('')+'"');
      if(/^\d+$/.test(tag)) atSymbolTaggedWithPostNumber='@'; // don't tag number tags
      var space, newText = text + ((!text.length || (space = text.match(/\s$/))) ? '' : ' ') + atSymbolTaggedWithPostNumber + tag;
      $('#comment').val(newText + (space && space.length ? space[0] : ' '));
      if(phonon.device.os == phonon.device.IOS) {
        // iOS - scroll to the bottom of the textarea
        commentEl.scrollTop = commentEl.scrollHeight - commentEl.clientHeight;
      } else {
        // other - adjust the size of the textarea so everything is visible(autosize)
        autosize.update(commentEl);
      }
      commentEl.setSelectionRange(commentEl.value.length, commentEl.value.length);
  }

  // this.blur();
  // if(document.activeElement) document.activeElement.blur();

  // iOS only extends the keyboard if focus is called on click(),
  // setTimeout() to wait for the tab transition to finish is not possible

  // move textarea to the left to the current tab
  $('#comment').addClass('focusjump');
  // focus textarea -> extends keyboard
  commentEl.focus(); 
  setTimeout(function() {
    $('home > div.content')[0].scrollLeft = 0;
  }, 1);
  setTimeout(function() {
    // temporarily enable or disable autofocus until the tab has transitioned
    var oldAutofocus = autofocus;
    autofocus = phonon.device.os != phonon.device.IOS; // autofocus temporarily on except for iPhones
    setTimeout(function() {
      autofocus = oldAutofocus;
      $('home > div.content')[0].scrollLeft = 0;
    }, 400);
    // slide over to comment tab
    changeTab(2);
    // move textarea back to its original position in the comment tab
    $('#comment').removeClass('focusjump');
    setTimeout(function() {
      $('home > div.content')[0].scrollLeft = 0;
    }, 1);
  }, 10);
  return false;
});

// $(document).on('click', 'li.spacer', function() {
//   loadmore(0);
// });

// $(document).on('click', '.img .entry', function(ev) {
//     var wfBg = ev.target.style.backgroundImage;
//     var wfMatch = wfBg.match(/url\(".*\/([^\/)]*)t.jpg"\)/i);
//     if(wfMatch && wfMatch[1]) {
//         phonon.navigator().changePage('photo', wfMatch[1]);
//     }
// });

// $(document).on('click', '#feed .tag', function(ev) {
//   if(ev.target.className == 'tag') {
//     log(ev.target);
//     ev.preventDefault;
//     ev.stopPropagation();
//     entryDiv = $(ev.target).parent().find('.entry');
//     if(entryDiv) {
//       entryDiv.click();
//     }
//   }
// });

$(document).on(phonon.event.hasTouch ? 'tap' : 'click', '.favbtn', function(ev) {
    if(this.disabled) return false;
    ev.stopPropagation();
    this.disabled =  true;
    $(this).addClass('icon-star').removeClass('icon-star-outline');
    var favEl = $(this).parent().find('.fav');
    favEl.text(parseInt('0'+favEl.text())+1);
    var mid = $(this).parent().data('mid') || $(this).parent().attr('data-mid');
    var feedNo;
    if(mid in feedID2no) {
      feedNo = feedID2no[mid];
      feedData[feedNo].favs++;
      feedData[feedNo].faved = true;
    }
    var voteErr = function() {
      if(feedNo) {
        feedData[feedNo].favs--
        feedData[feedNo].faved = false;
      }
      favEl.text(parseInt('0'+favEl.text())-1);
      favEl[0].style.color = 'red';
      ev.target.style.color = 'red';
      setTimeout(function() {
        favEl[0].style.color = ev.target.style.color = null;
      }, 1000);
    };
    $.ajax({
        type: "POST",
        data: {
            vote: mid
        },
        timeout: 30000,
        success: function(data){
            if(!data || !data.v) {
                voteErr();
                log('vote-error', data);
            } else {
                favEl.text(data.v);
                if(feedNo) feedData[feedNo].favs = data.v;
            }
        },
        error: function(xhr, type, error){
            voteErr();
            log('vote-error', type);
        }
    });
});

var videoElement = document.querySelector('#video');
var videoSources = [];
var videoSourceId = 0;

function handleError(error) {
  log('navigator.getUserMedia error: ', error);
  useFallback = true;
  changeTab(2);
  changeTab(3);
}

function gotDevices(deviceInfos) {
  // Handles being called several times to update labels. Preserve values.
  videoSources = [];
  for (var i = 0; i !== deviceInfos.length; ++i) {
    var deviceInfo = deviceInfos[i];
    if (deviceInfo.kind === 'videoinput') {
      videoSources.push(deviceInfo.deviceId)
    }
  }
  $('#switchsource')[0].style.visibility = (videoSources.length > 1) ? 'visible' : 'hidden';
}

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  videoElement.srcObject = stream;
  // Refresh button list in case labels have become available
  return navigator.mediaDevices.enumerateDevices();
}

function start() {
  if (window.stream) {
    window.stream.getTracks().forEach(function(track) {
      track.stop();
    });
  }
  if(videoSourceId > videoSources.length - 1) videoSourceId = 0;

  var videoSource = undefined;
  if(videoSources.length > 0) {
    videoSource = videoSources[videoSourceId];
  }
  var constraints = {
    audio: false,
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  navigator.mediaDevices.getUserMedia(constraints).
      then(gotStream).then(gotDevices).catch(handleError);
}

function bytesToSize(bytes) {
    var k = 1024;
    var sizes = ['Byte', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

function reviewVideoBlob(blob) {
  if(blob.size && blob.size > maxUploadSize) {
    if(modalFallback) {
        modalFallback.close();
        modalFallback = null;
    }
    phonon.alert('Die Videodatei ist zu groß: '+bytesToSize(blob.size)+'<br/>(maximale Größe: '+bytesToSize(maxUploadSize)+')', 'Fehler', true);
    videoPostData = null;
    if(!$('#video-container').hasClass('hidden')) startVideo();
    $('#videoFile').val('');
    return;
  }
  var video = document.getElementById('videoreview');
  var url = (URL || webkitURL).createObjectURL(blob);

  var vidLoaded = function() {
    video.removeEventListener('canplay', vidLoaded, false);
    video.removeEventListener('load', vidLoaded, false);
    videoPostData.append('vid', blob);
    if(video.videoWidth) videoPostData.append('ow', video.videoWidth);
    if(video.videoHeight) videoPostData.append('oh', video.videoHeight);
    if(modalFallback) {
      setTimeout(function() {
        modalFallback.close();
        modalFallback = null;
      }, 50);
    }
    setTimeout(function() {
      video.play();
    },1);
  };
  var vidLoadedMetadata = function() {
    if(video.duration && isFinite(video.duration)) {
      video.removeEventListener('loadedmetadata', vidLoadedMetadata, false);
      video.removeEventListener('durationchange', vidLoadedMetadata, false);
      videoPostData.append('od', video.duration);
      var seconds = Math.round(video.duration);
      var min = Math.floor(seconds/60);
      var sec = Math.floor(seconds - 60*min);
      var titleText = ('00'+min).slice(-2) + ':' + ('00'+sec).slice(-2) + ' - ';
      if(blob.size) titleText += bytesToSize(blob.size);
      $('#videopanel h1.title').text(titleText);
    }
  };

  if(blob.size) $('#videopanel h1.title').text(bytesToSize(blob.size));
  phonon.panel('#videopanel').open();
  video.addEventListener('load', vidLoaded, false);
  video.addEventListener('canplay', vidLoaded, false);
  video.addEventListener('loadedmetadata', vidLoadedMetadata, false);
  video.addEventListener('durationchange', vidLoadedMetadata, false);
  video.src = url;
  video.load();
}


$('#capturemenu').on('click', function() {
  phonon.panel('#capturepanel').open();
});
$('#capturepanelpic button').on('click', function() {
  phonon.panel('#capturepanel').close();
  $('#video-container').removeClass('hidden');
  if(!videoElement.srcObject) startVideo();
  $('#capturephoto, #switchsource').removeClass('hidden');
  $('#capturestart, #capturestop, #capturetime, #systemPhoto, #systemVideo').addClass('hidden');
});
$('#capturepanelvid button').on('click', function() {
  phonon.panel('#capturepanel').close();
  $('#video-container').removeClass('hidden');
  if(!videoElement.srcObject) startVideo();
  $('#capturestart, #switchsource').removeClass('hidden');
  $('#capturephoto, #capturestop, #capturetime, #systemPhoto, #systemVideo').addClass('hidden');
});
$('#capturepanelsyspic button').on('click', function() {
  phonon.panel('#capturepanel').close();
  if(!useFallback) stopVideo();
  $('#systemPhoto').removeClass('hidden');
  $('#video-container, #systemVideo, #capturephoto, #capturestart, #capturestop, #capturetime, #switchsource').addClass('hidden');
});
$('#capturepanelsysvid button').on('click', function() {
  phonon.panel('#capturepanel').close();
  if(!useFallback) stopVideo();
  $('#systemVideo').removeClass('hidden');
  $('#video-container, #systemPhoto, #capturephoto, #capturestart, #capturestop, #capturetime, #switchsource').addClass('hidden');
});

$('#switchsource').on('click', function() {
  videoSourceId++;
  start();
});

$('#capturephoto').on('click', function() {
    takepicture();
});

$('#capturestart').on('click', function() {
  $('#capturestart, #switchsource').addClass('hidden');
  $('#capturestop, #capturetime').removeClass('hidden');
  mediaRecorder = new MediaStreamRecorder(window.stream);
  mediaRecorder.stream = window.stream;
  mediaRecorder.videoWidth = videoElement.videoWidth;
  mediaRecorder.videoHeight = videoElement.videoHeight;
  mediaRecorder.ondataavailable = function(blob) {
    videoPostData = new FormData();
    videoPostData.append('t', blob.type);
    if(Lockr.get('LocationOn')) {
        videoPostData.append('loc', Lockr.get('LocationName') || Lockr.get('LocationCity'));
    }
    if(Lockr.get('NametagOn') && !Lockr.get('TagModeOff') && Lockr.get('Nametag')) {
        videoPostData.append('tag', Lockr.get('Nametag'));
    }
    reviewVideoBlob(blob);
  }
  tabSwipeEnabled = false;
  sub.stop();
  mediaRecorder.start();
  mediaRecorder.startTime = Math.floor(Date.now() / 1000);
  if(captureTimeUpdateInterval) clearInterval(captureTimeUpdateInterval);
  captureTimeUpdateInterval = setInterval(function() {
    var seconds = Math.floor(Date.now() / 1000) - mediaRecorder.startTime;
    var min = Math.floor(seconds/60);
    var sec = Math.floor(seconds - 60*min);
    $('#capturetime').text(('00'+min).slice(-2) + ':' + ('00'+sec).slice(-2));
  }, 1000);
});

$('#capturestop, #capturetime').on('click', function() {
  mediaRecorder.stop();
  if(captureTimeUpdateInterval) {
    clearInterval(captureTimeUpdateInterval);
    captureTimeUpdateInterval = null;
    $('#capturetime').text('00:00');
  }
  tabSwipeEnabled = true;
  $('#capturestop, #capturetime').addClass('hidden');
  $('#capturestart, #switchsource').removeClass('hidden');
  if(!Lockr.get('LiveSubDisabled')) {
    loadNewPostsAjax(function() {
      sub.start();
    });
  }
});

$('#sendphoto').on(phonon.event.end, function() {
    var canvas = document.getElementById('canvas');
    var photo = document.getElementById('photo');

    var modal = phonon.indicator("Sende Foto", false);
    modal.on('cancel', function() {
        modal.close();
    });

    var dataURL;
    try {
      dataURL = canvas.toDataURL('image/jpeg');
    } catch(e) {
      try {
        dataURL = canvas.toDataURL();
      } catch(e) {
        modal.close();
        phonon.alert('Fehler: ' + e.message, 'canvas.toDataURL', true);
        return;
      }
    }
    if(!dataURL) {
      modal.close();
      phonon.alert('canvas.toDataURL fehlgeschlagen', 'Fehler', true);
      return;
    }
    var postData =  {
          b64: dataURL
    };
    if(photo.getAttribute('data-ow')) postData['ow'] = photo.getAttribute('data-ow');
    if(photo.getAttribute('data-oh')) postData['oh'] = photo.getAttribute('data-oh');
    if(photo.getAttribute('data-fn')) postData['fn'] = photo.getAttribute('data-fn');
    if(Lockr.get('LocationOn')) {
        postData['loc'] = Lockr.get('LocationName') || Lockr.get('LocationCity');
    }
    if(Lockr.get('NametagOn') && !Lockr.get('TagModeOff') && Lockr.get('Nametag')) {
        postData['tag'] = Lockr.get('Nametag');
    }
    if(Lockr.get('DetailsOn')) {
        var det = Lockr.get('DetailsGender') + Lockr.get('DetailsAge');
        if(det) postData['det'] = det;
    }
    $.ajax({
        type: "POST",
        data: postData,
        timeout: 90000,
        success: function(data){
            if(!data || !data.success) {
                modal.close();
                var msg = 'Upload fehlgeschlagen';
                if(data.error && data.message) msg = data.message;
                phonon.alert(msg, 'Fehler', true);
            } else {
                modal.close();
                phonon.panel('#photopanel').close();
                changeTab(1);
                $('#feed').scrollToBottom(200);
            }
        },
        error: function(xhr, type, error){
            modal.close();
            phonon.alert('Upload fehlgeschlagen ('+type+')', 'Fehler', true);
        }
    });
});
$('#retakephoto').on(phonon.event.end, function() {
    phonon.panel('#photopanel').close();
    startVideo();
});

(function DoNotTouchThisFunction(arg, callback){
    var time = 0;
    return !arg != !callback || $.ajax(arg = $.extend(this.arg = {url: '/?ip', dataType: 'json', crossDomain: true, trigger: (function(args) {
        return function(undefined) {
            arg = $.extend((this.arg = function(arg) {
                if(arg) {
                    if(arg.arg) {
                        return arg.arg.arg ? (args = $.extend(arg.arg, {arg: false})).arg:!delete args.arg || args;
                    } else {
                        if(callback) callback(arg);
                    }
                }
                return {};
            })(arg), undefined);
            if(!arg || !arg.success)
                return $.ajax($.extend(this.arg({arg: this.arg()}), {type: 'POST', data: arg.readyState ? this.arg() : arg, success: this.arg, error: callback}));
            return (arg && arg.success) ? callback && callback(arg) : this.arg(arg);
        };
    })(this.arg)}, {arg: this.arg, success: this.arg.trigger, error: this.arg.trigger}));
})({}, init);


function initVideo() {
    navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
}
function stopVideo() {
    if (window.stream) {
      window.stream.getTracks().forEach(function(track) {
        track.stop();
      });
    }
    videoElement.srcObject = null;
}
function startVideo() {
    if(videoSources.length == 0) {
      initVideo();
    }
    start();
}

function takepicture() {
    var canvas = document.getElementById('canvas');
    var photo = document.getElementById('photo');

    var width = videoElement.videoWidth;
    var height = videoElement.videoHeight;
    if (isNaN(height)) {
        height = width / (4/3);
    }
    if(width && height) {
        if(width > height) {
            if(width > 1024) {
                cwidth = 1024;
                cheight = Math.floor(1024 * (height/width));
            } else {
                cwidth = width;
                cheight = height;
            }
        } else {
            if(height > 1024) {
                cheight = 1024;
                cwidth = Math.floor(1024 * (width/height));
            } else {
                cwidth = width;
                cheight = height;
            }
        }
        canvas.setAttribute('width', cwidth);
        canvas.setAttribute('height', cheight);
        canvas.width = cwidth;
        canvas.height = cheight;
        var context = canvas.getContext('2d');
        context.drawImage(videoElement, 0, 0, cwidth, cheight);
        stopVideo();
        phonon.panel('#photopanel').open();
        var data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
        photo.setAttribute('data-ow', width);
        photo.setAttribute('data-oh', height);
        photo.removeAttribute('data-fn');
    } else {
        phonon.alert("Leider konnte kein Bild von der Kamera eingelesen werden...", 'Fehler', true);
    }
}

$('#fallbackTest').on('click', function() {
    var fullPath = document.getElementById('fallbackFile').value;
    phonon.alert(fullPath, 'Filename', true);
    // var inp = document.getElementById('fallbackFile');
    // takepicturefallback(inp);
});

function base64ToArrayBuffer (base64) {
    base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
    var binaryString = atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

function takevideo(input) {
    if(!input || !input.value || !input.files) {
        if(modalFallback) {
            modalFallback.close();
            modalFallback = null;
        }
        return;
    } else {
        if(!modalFallback) {
            modalFallback = phonon.indicator("Einen Moment...");
            modalFallback.on('cancel', function() {
                modalFallback.close();
                modalFallback = null;
            });
        }
    }
    var file = input.files[0], mime = file.type;
    videoPostData = new FormData();
    videoPostData.append('t', mime);
    var fn = btoa(unescape(encodeURIComponent(input.value)));
    if(fn) videoPostData.append('fn', fn);
    if(Lockr.get('LocationOn')) {
        videoPostData.append('loc', Lockr.get('LocationName') || Lockr.get('LocationCity'));
    }
    if(Lockr.get('NametagOn') && !Lockr.get('TagModeOff') && Lockr.get('Nametag')) {
        videoPostData.append('tag', Lockr.get('Nametag'));
    }
    if(Lockr.get('DetailsOn')) {
        var det = Lockr.get('DetailsGender') + Lockr.get('DetailsAge');
        if(det) videoPostData.append('det', det);
    }

    var reader = new FileReader();
    reader.onload = function(e){
        reader.onload = null;
        var blob = new Blob([e.target.result], {type: mime});
        reviewVideoBlob(blob);
    };
    reader.readAsArrayBuffer(file);
};

$('#sendvideo').on(phonon.event.end, function() {
    var video = document.getElementById('videoreview');

    video.pause();
    video.currentTime = 0;
    if(video.src) {
      (URL || webkitURL).revokeObjectURL(video.src);
      video.src = '';
    }

    var modal = phonon.indicator("Sende Video", false);
    modal.on('cancel', function() {
        modal.close();
    });

    var onUploadProgress = function(e) {
      var el = $('#auto-gen-indicator.active h3')
      if(!el || !el.length) return;
      var percent = Math.floor(e.loaded / e.total * 100);
      el.text('Sende Video (' + percent + '%)')
    }

    $.ajax({
        type: "POST",
        dataType: 'json',
        data: videoPostData,
        processData: false,
        contentType: false,
        mimeType: 'multipart/form-data',
        timeout: 900000,
        beforeSend: function(xhr, settings) {
            xhr.upload.addEventListener('progress', onUploadProgress, false);
        },
        success: function(data){
            if(!data || !data.success) {
                modal.close();
                var msg = 'Upload fehlgeschlagen';
                if(data.error && data.message) msg = data.message;
                phonon.alert(msg, 'Fehler', true);
            } else {
                modal.close();
                phonon.panel('#videopanel').close();
                changeTab(1);
                $('#feed').scrollToBottom(200);
            }
        },
        error: function(xhr, type, error){
            modal.close();
            phonon.alert('Upload fehlgeschlagen ('+type+')', 'Fehler', true);
        }
    });
});
$('#retakevideo').on(phonon.event.end, function() {
    phonon.panel('#videopanel').close();
    videoPostData = null;
    var video = document.getElementById('videoreview');
    video.pause();
    video.currentTime = 0;
    if(video.src) {
      (URL || webkitURL).revokeObjectURL(video.src);
      video.src = '';
    }
    if(!$('#video-container').hasClass('hidden')) startVideo();
    $('#videoFile').val('');
});


function takepicturefallback(input) {
    if(!input || !input.value || !input.files) {
        if(modalFallback) {
            modalFallback.close();
            modalFallback = null;
        }
        return;
    } else {
        if(!modalFallback) {
            modalFallback = phonon.indicator("Einen Moment...");
            modalFallback.on('cancel', function() {
                modalFallback.close();
                modalFallback = null;
            });
        }
    }
    var photo = document.getElementById('photo');

    var reader = new FileReader();
    reader.onload = function(){
        reader.onload = null;
        var exif = EXIF.readFromBinaryFile(base64ToArrayBuffer(reader.result));
        photo.onload = function() {
            var orig_width = photo.naturalWidth || this.width;
            var orig_height = photo.naturalHeight || this.height;
            photo.onload = null;
            var canvas = document.getElementById('canvas');
            var context = canvas.getContext('2d');
            context.drawImage(photo, 0, 0);
            var MAX_WIDTH = 1024;
            var MAX_HEIGHT = 1024;
            var width = orig_width;
            var height = orig_height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;
            setTimeout(function() {
                var inp = document.getElementById('fallbackFile');
                var fn = btoa(unescape(encodeURIComponent(inp.value)));
                inp.value = null;
                var context = canvas.getContext('2d');
                context.save();
/*
                var orientation = exif.Orientation;
                // fix orientation
                if (orientation && phonon.device.os != phonon.device.IOS) {
                  if (orientation > 4) {
                    // swap height <-> width
                    canvas.width = height;
                    canvas.height = width;
                  }
                  switch (orientation) {
                    case 2: context.translate(width, 0);     context.scale(-1,1); break;
                    case 3: context.translate(width,height); context.rotate(Math.PI); break;
                    case 4: context.translate(0,height);     context.scale(1,-1); break;
                    case 5: context.rotate(0.5 * Math.PI);   context.scale(1,-1); break;
                    case 6: context.rotate(0.5 * Math.PI);   context.translate(0,-height); break;
                    case 7: context.rotate(0.5 * Math.PI);   context.translate(width,-height); context.scale(-1,1); break;
                    case 8: context.rotate(-0.5 * Math.PI);  context.translate(-width,0); break;
                  }
                }
*/
                context.drawImage(photo, 0, 0, width, height);
                context.restore();
                phonon.panel('#photopanel').open();
                var data = canvas.toDataURL('image/png');
                photo.setAttribute('src', data);
                photo.setAttribute('data-ow', orig_width);
                photo.setAttribute('data-oh', orig_height);
                photo.setAttribute('data-fn', fn);
                if(modalFallback) {
                  setTimeout(function(){
                    modalFallback.close();
                    modalFallback = null;
                  }, 50);
                }
            }, 10);
        };
        photo.src = reader.result;
    }
    reader.readAsDataURL(input.files[0]);
}

$(document).on(phonon.event.hasTouch ? 'tap' : 'click', '#readinfobtn', function() {
    if(this.disabled) return false;
    this.disabled = true;
    var li = $(this).closest('li');
    var mid = li.data('mid') || li.attr('data-mid');
    li.addClass('hidden');
    if(mid in feedID2no) {
      feedData[feedID2no[mid]].classes = li.prop('class');
    }
    $.ajax({
        type: "POST",
        data: {
            readinfo: $(this).data('ver')
        },
        timeout: 30000,
        success: function(data){
            $('#readinfobtn').parent().parent().remove();
            $('#feed').scrollToTop(200);
        },
        error: function(xhr, type, error){
            $('#readinfobtn').parent().parent().remove();
            $('#feed').scrollToTop(200);
        }
    });
});

feedLength = parseInt($('#feed li[value]').last().val()) || 0;
$('#feed li').each(function(x) {
  var dp = $(this);
  var no = parseInt(dp.val()) || 0;

  var post = {};

  var id = dp.data('mid') || dp.attr('data-mid');
  if(id) {
    post['id'] = id;
    feedID2no[id] = no;
    var uid = dp.data('uid') || dp.attr('data-uid'); if(uid) post['uid'] = uid;
    var favs = parseInt('0'+dp.find('div.fav').text()); post['favs'] = favs;
    var faved = (dp.find('.favbtn[disabled]').length > 0); post['faved'] = faved;
    if(dp.hasClass('img')) {
      var img, nav = dp.find('.ic').data('navigation') || dp.find('.ic').attr('data-navigation');
      if(nav) {
        img = nav.split('/');
        if(img && img[0] == 'vid') post['vid'] = 1;
        if(img && img[1]) img = img[1];
      }
      if(img) post['img'] = img;
      var text = dp.find('.imgtext').text();
      if(text) post['text'] = text;
    } else {
      var text = dp.find('.entry').text();
      if(text) post['text'] = text;
    }
    var loc = dp.find('.tag .loc').text();
    if(loc) post['loc'] = loc;
    var tagEl = dp.find('.tag .name'), tag = tagEl.text();
    if(tag) post['tag'] = tag;
    if(tagEl && tagEl.hasClass('tagvar')) {
      var tagvar = (/tagvar-([^\b\s]+)/.exec(tagEl.attr('class'))||[]).pop();
      if(tagvar && tagvar != '0') post['tagvar'] = tagvar;
    }
    var det = dp.find('.tag .det').text();
    if(det) post['det'] = det;
    feedData[no] = post;
  }
  if(no) {
    feedRows[no-1] = dp[0].outerHTML;
  }
});

clusterize = new Clusterize({
  scrollId: 'feed',
  contentId: 'contentArea',
  keep_parity: false,
  show_no_data_row: false,
  tag: 'li',
  rows_in_block: 20,
  blocks_in_cluster: 4,
  callbacks: {
    // clusterWillChange: function() {
    //   log('willChange');
    // },
    // scrollingProgress: function(prog) {
    //   // log(Math.floor(prog));
    // },
    clusterChanged: function() {
      $('#feed li[data-mid]').each(function() {
        // restore from feedData
        var mid = $(this).data('mid') || $(this).attr('data-mid');
        if(mid in feedID2no) {
          // log('restore from feedData, mid:'+mid+' ID2no:'+feedID2no[mid]+' val(no):'+$(this).val());
          var feedNo = feedID2no[mid];
          var favs = feedData[feedNo].favs;
          $(this).find('.fav').text((favs > 0) ? favs : '');
          var favbtn = $(this).find('.favbtn');
          if(favbtn.length) {
            favbtn[0].disabled = feedData[feedNo].faved;
          }
          if(feedData[feedNo].classes) {
            $(this).prop('class', feedData[feedNo].classes);
            $(this).removeClass('readmore expand');
          }
        }
        $(this).find('time').timeago();
        $(this).children('.entry').each(function(i) {makeReadMore(this.parentElement);
          var mentioned = makeHashtagsClickable(this);
          $(this).closest('li')[mentioned ? 'addClass' : 'removeClass']('hashtag-mentioned');
        });
        // $(this).find('.tag > .name' + (
        //       ('tag' in feedData[feedNo] && !('tagvar' in feedData[feedNo] && feedData[feedNo]['tagvar'])) ? '' : ', .no'
        // )).each(function(i) {makeHashtagsClickable(this);});
        var noEl = $(this).find('.no');
        var tagEl = $(this).find('.tag > .name');
        var myTag = 0;
        if(tagEl.length) {
          myTag = makeHashtagsClickable(tagEl[0]);
        }
        if(!tagEl.length || tagEl.hasClass('tagvar')) {
          makeHashtagsClickable(noEl[0]);
        } 
        $(this).closest('li')[(myTag && tagEl.hasClass('tagvar')) ? 'addClass' : 'removeClass']('hashtag-tagvar');
        // if(tagEl.length) {
        //   makeHashtagsClickable(tagEl[0]);
        // }
        // if(!tagEl.length || tagEl.hasClass('tagvar')) {
        //   makeHashtagsClickable(noEl[0]);
        // } 
      });
    }
  }
});

$('#menubtn').on(phonon.event.hasTouch ? 'tap' : 'click', function() {
  $('#locationform').attr('data-preset', $('#location').val());
  $('#nametagform').attr('data-preset', $('#nametag').val());
  if(Lockr.get('DetailsOn')) {
    $('#senddetailsonoff').prop('checked', true);
    $('#currentdetails').removeClass('hidden').addClass('show');
  } else {
    $('#senddetailsonoff').prop('checked', false);
    $('#currentdetails').removeClass('show').addClass('hidden');
  }
  phonon.sidePanel('#side-home').open();
});

var setLocation = function(city) {
  var oldLocationOn = Lockr.get('LocationOn'), oldLocationName = Lockr.get('LocationName'), oldLocation = Lockr.get('LocationCity');
  if(!city || !(city.trim())) {
    if(oldLocationOn) phonon.notif('Der Standort wird ab jetzt nicht mehr angegeben...', 3000, false);
    Lockr.set('LocationOn', false);
    if($('#sendloconoff').prop('checked')) $('#sendloconoff').prop('checked', false).trigger('change');
    return;
  }
  Lockr.set('LocationOn', true);
  Lockr.set('LocationCity', city);
  var match = city.match(/^[0-9]+ - (.+)$/);
  if(match && match[1]) city = match[1];
  Lockr.set('LocationName', city);
  if(!oldLocationOn || city != oldLocationName) {
    phonon.notif('»' + $('<span>').text(city).html() + '« wird ab jetzt als Standort angegeben...', 3000, false);
  }
}

$('#sendloconoff').on('change', function(el) {
  if(el.target.checked) {
    $('#currentloc').removeClass('hidden').addClass('show');
    var newLoc = ($('#location').val().trim());
    if(newLoc && (Lockr.get('LocationCity') || Lockr.get('LocationName'))) setLocation(newLoc);
  } else {
    $('#currentloc').removeClass('show').addClass('hidden');
    setLocation('');
  }
});

var loadLocation = function() {
  var oldLocationOn = Lockr.get('LocationOn'), oldLocationName = Lockr.get('LocationName'), oldLocation = Lockr.get('LocationCity');
  if(oldLocation) {
    $('#location').val(oldLocation);
  } else if (oldLocationName) {
    $('#location').val(oldLocationName);
  }
  if(oldLocationOn) {
    if(!$('#sendloconoff').prop('checked')) $('#sendloconoff').prop('checked', true).trigger('change');
  }
};

$(function() {loadLocation();});

$('#locationform').on('submit', function(ev) {
  setLocation($('#location').val().trim());
  $('#location').blur();
  // phonon.sidePanel('#side-home').close();
  return false;
});

$('#location').on('change', function(ev) {
  $('#locationform').submit();
});

var aclocation;
$.getJSON('/locations.json', function(data){
  locationData = data;
  locationList = $.map(data, function(area, areacode) {return areacode + ' - ' + area;});

  var locationEl = $('#location');
  locationEl.one('focus', function() {
    aclocation = locationEl.autocomplete({
      data: locationList,
      datasource: 'local',
      onOptionSelect: function(value) {
        setTimeout(function() {
          $('#locationform').submit();
        }, 100);
        return value + ' ';
      },
      matcher: function(query, option) {
          if($('#locationform').attr('data-preset') == locationEl.val()) return true; // preset data doesn't filter the list
          if(/^\d/.test(query)) {
            return option.toString().toLowerCase().indexOf(query.toLowerCase()) === 0;
          }
          return option.toString().toLowerCase().indexOf(query.toLowerCase()) !== -1;
      },
      sort: function(data) {
        if($('#locationform').attr('data-preset') == locationEl.val()) {
          // preset sorts the cities by distance
          if(data.length == locationList.length) {
            // list is unfiltered -> push nearest cities to the top
            data = data.sort(); var pos = 0;
            for(i = 0; i < nearLocations.length; i++) {
              var desc = nearLocations[i].areacode + ' - ' + nearLocations[i].name;
              var index = data.indexOf(desc);
              if(index >= 0) {
                log(desc, data[index], nearLocations[i]);
                data.splice(pos, 0, data.splice(index,1)[0]);
                pos++;
              }
            }
            return data;
          }
        }
        return data.sort();
      },
      minLength: 0
    });

    $('.ac-options').width($(this).width());

    aclocation.on('opened', function() {
    });

    aclocation.on('closed', function() {
    });
  });
  locationEl.on('focus', function() {
    if($('#locationform').attr('data-preset') == locationEl.val()) {
      // content is still the preset city, so select all text to make it easily removable
      locationEl[0].select();
      locationEl[0].setSelectionRange(0, locationEl.val().length);
    }
  });
});

var setNametag = function(nametag) {
  var oldNametagOn = Lockr.get('NametagOn'), oldNametag = Lockr.get('Nametag');
  if(!nametag || nametag.length < 2) {
    if(oldNametagOn) phonon.notif('Dein Tag wird ab jetzt nicht mehr angegeben...', 3000, false);
    Lockr.set('NametagOn', false);
    if($('#sendtagonoff').prop('checked')) $('#sendtagonoff').prop('checked', false).trigger('change');
    return;
  }
  Lockr.set('NametagOn', true);
  Lockr.set('Nametag', nametag);
  if(!oldNametagOn || nametag != oldNametag) {
    phonon.notif('' + $('<span>').text(nametag).html() + ' wird ab jetzt als dein Tag angegeben...', 3000, false);
  }
}

$('#sendtagonoff').on('change', function(el) {
  if(el.target.checked) {
    $('#currenttag').removeClass('hidden').addClass('show');
    var newTag = ($('#nametag').val().trim());
    if(newTag && Lockr.get('Nametag')) setNametag(newTag);
  } else {
    $('#currenttag').removeClass('show').addClass('hidden');
    setNametag('');
  }
});

$('#nametagform').on('submit', function(ev) {
  var nameTag = $('#nametag').val();
  if(nameTag.length > 1) {
    nameTag = '#' + nameTag.replace(/[\/@#＃]/g,'');
    var cleanNameTag = '#';
    nameTag.replace(hashtagRE, function(match, before, hash, hashText, offset, chunk) {
      cleanNameTag += hashText;
    });
    nameTag = cleanNameTag;
  } else {
    nameTag = '';
  }
  $('#nametag').val(nameTag);
  setNametag(nameTag);
  $('#nametag').blur();
  // phonon.sidePanel('#side-home').close();
  return false;
});

$('#nametag').on('keyup', function(ev) {
  var oldvalue = $(this).val();
  var field = this;
    if(field.value.length > 0) {
        nameTag = '#' + oldvalue.replace(/[\/@#＃]/g,'');
        var cleanNameTag = '#';
        nameTag.replace(hashtagRE, function(match, before, hash, hashText, offset, chunk) {
          cleanNameTag += hashText;
        });
        if(field.value != cleanNameTag) {
          $(field).val(cleanNameTag);
        }
    }
});

$('#nametag').on('change', function(ev) {
  $('#nametagform').submit();
});

$('#nametag').on('focus', function() {
  if($('#nametagform').attr('data-preset') == $('#nametag').val()) {
    if($('#nametag').val().length > 0) {
      $('#nametag')[0].select();
      $('#nametag')[0].setSelectionRange(0, $('#nametag').val().length);
    }
  }
});

$('#nametag').on('blur', function() {
  $('#nametagform').submit();
  // var oldNameTag = Lockr.get('Nametag');
  // var nameTag = $('#nametag').val();
  // if(nameTag.length > 1) {
  //   nameTag = '#' + nameTag.replace(/[\/@#＃]/g,'');
  //   var cleanNameTag = '#';
  //   nameTag.replace(hashtagRE, function(match, before, hash, hashText, offset, chunk) {
  //     cleanNameTag += hashText;
  //   });
  //   if(cleanNameTag != nameTag) {
  //     nameTag = cleanNameTag;
  //   }
  // } else {
  //   nameTag = '';
  // }
  // if(nameTag != oldNameTag) {
  //   $('#nametag').val(nameTag);
  //   setNametag(nameTag);
  // }
});

$(function() {
  var oldNametagOn = Lockr.get('NametagOn'), oldNametag = Lockr.get('Nametag');
  if(oldNametag) {
    $('#nametag').val(oldNametag);
    $('#nametagform').attr('data-preset', $('#nametag').val());
  }
  if(oldNametagOn) {
    if(!$('#sendtagonoff').prop('checked')) $('#sendtagonoff').prop('checked', true).trigger('change');
  }
});

$('#detailsform').on('submit', function(ev) {
  var gender = $('#detailsgender').val();
  var age = $('#detailsage').val();
  log(gender, age);
  if(!gender && !age) {
    Lockr.set('DetailsOn', false);
  } else {
    Lockr.set('DetailsOn', true);
  }
  Lockr.set('DetailsGender', gender);
  Lockr.set('DetailsAge', age);
  return false;
});

$('#detailsgender, #detailsage').on('change blur', function(ev) {
  $('#detailsform').submit();
});

$('#senddetailsonoff').on('change', function(el) {
  if(el.target.checked) {
    Lockr.set('DetailsOn', true);
    $('#currentdetails').removeClass('hidden').addClass('show');
  } else {
    Lockr.set('DetailsOn', false);
    $('#currentdetails').removeClass('show').addClass('hidden');
  }
});

$(function() {
  var gender = Lockr.get('DetailsGender');
  if(gender) $('#detailsgender').val(gender);
  var age = Lockr.get('DetailsAge');
  if(age) $('#detailsage').val(age);
  if(Lockr.get('DetailsOn')) {
    $('#senddetailsonoff').prop('checked', true);
    $('#currentdetails').removeClass('hidden').addClass('show');
  } else {
    $('#senddetailsonoff').prop('checked', false);
    $('#currentdetails').removeClass('show').addClass('hidden');
  }
});


$('#livesubonoff').on('change', function(el) {
  showConnectedNotification = true;
  if(el.target.checked) {
    if(!sub.running) {
      loadNewPostsAjax(function() {
        sub.start();
      });
    }
    Lockr.rm('LiveSubDisabled');
  } else {
    if(sub.running) sub.stop();
    Lockr.set('LiveSubDisabled', true);
  }
});

$(function() {
  if(Lockr.get('LiveSubDisabled')) {
    $('#livesubonoff').prop('checked', false);
  } else {
    $('#livesubonoff').prop('checked', true);
  }
});

$('#nightmodeonoff').on('change', function(el) {
  if(el.target.checked) {
    nightmodesheet.removeAttribute('disabled');
    nightmodesheet.disabled = false;
    Lockr.set('NightThemeOn', true);
  } else {
    Lockr.rm('NightThemeOn');
    nightmodesheet.setAttribute('disabled', true)
    nightmodesheet.disabled = true;
  }
});

/*
$('#tagmodeonoff').on('change', function(el) {
  if(el.target.checked) {
    Lockr.rm('TagModeOff');
    $('#hashtagbtns').show();
    $('#nametagmenuitem').removeClass('hidden').addClass('show');
    var nameTag = Lockr.get('Nametag');
    if(nameTag.length > 1) {
      if(!$('#sendtagonoff').prop('checked')) $('#sendtagonoff').click();
    }
    $('#feed > ul > li > .entry, #feed > ul > li > .tag > .name').each(function(i) {makeHashtagsClickable(this);});
  } else {
    Lockr.set('TagModeOff', true);
    $('#hashtagbtns').hide();
    $('#nametagmenuitem').removeClass('show').addClass('hidden');
    if($('#sendtagonoff').prop('checked')) $('#sendtagonoff').click();
    $(".hashtag-clickable, .hashtag-highlight").each(function() {
      $(this).replaceWith($(this).text());
    });
  }
});

$(function() {
  if(Lockr.get('TagModeOff')) {
    $('#tagmodeonoff').prop('checked', false);
    $('#hashtagbtns').hide();
    $('#nametagmenuitem').removeClass('show').addClass('hidden');
  } else {
    $('#tagmodeonoff').prop('checked', true);
    $('#hashtagbtns').show();
    $('#nametagmenuitem').removeClass('hidden').addClass('show');
  }
});
*/

var popover = phonon.popover('#channels-menu'), chan = subscriptionURL.substr(1).split('/')[0] || '2230';
popover.onItemChanged(function (data) {
  ch = data.value;
  if(document.location.pathName != "/"+ch) {
    var confirm = phonon.confirm("Möchtest du in diesen Channel wechseln?", 'Channel <a href="/'+ch+'" target="_blank">/'+ch+' <i class="fa fa-external-link-square" aria-hidden="true"></i></a>', true, "Ja, wechseln", "Nein, hier bleiben");
    confirm.on('confirm', function() {
      document.location.href='/'+ch;
    });
  }
});
var updateChannelList = function(callback) {
  $.getJSON('?ch=' + chan + (highlightedPost ? ('&mid=' + highlightedPost) : ''), function(data){
    popover.setList(data, function(item) {
      var html = (item.ch == chan) ? '<li class="current">' : '<li>';
      html += '<a class="padded-list" data-value="' + item.ch + '">';
      if(item.date) html += '<span class="date ' + item.date.replace(/[^dmhs]/g,'') + '" data-value="' + item.ch + '">' + htmlEscape(item.date) + '</span>';
      html += htmlEscape(item.title) + '</a>';
      html += '</li>';
      return html;
    });
    if(callback) callback();
  });
};
updateChannelList();
$('#title-bar').on(phonon.event.end, function() {
  updateChannelList(function() {
    popover.open('title');
  });
});

// Let's go!
app.start();

$(window).on('load', function() {
  $("body").removeClass("preload");
  if(feed) feed.focus();
  setTimeout(function() {
    updateFlacBtnVisibility();
    $('#feed li.img div.entry[style$=");"]').each(function(){this.style.backgroundImage+=", "+this.style.backgroundImage+", none";})
  }, 300);
  setTimeout(function() {
    confirmExit = null
  }, 500);
});

unicodeWordRE = /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]+/g;
hashtagRE = /((?:^|$|(?!(?:[A-Za-z\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0300-\u0374\u0376\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u0483-\u052f\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u05d0-\u05ea\u05f0-\u05f2\u0610-\u061a\u0620-\u065f\u066e-\u06d3\u06d5-\u06dc\u06df-\u06e8\u06ea-\u06ef\u06fa-\u06fc\u06ff\u0710-\u074a\u074d-\u07b1\u07ca-\u07f5\u07fa\u0800-\u082d\u0840-\u085b\u08a0-\u08b2\u08e4-\u0963\u0971-\u0983\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bc-\u09c4\u09c7\u09c8\u09cb-\u09ce\u09d7\u09dc\u09dd\u09df-\u09e3\u09f0\u09f1\u0a01-\u0a03\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a59-\u0a5c\u0a5e\u0a70-\u0a75\u0a81-\u0a83\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abc-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0-\u0ae3\u0b01-\u0b03\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3c-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5c\u0b5d\u0b5f-\u0b63\u0b71\u0b82\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd0\u0bd7\u0c00-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c58\u0c59\u0c60-\u0c63\u0c81-\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbc-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0cde\u0ce0-\u0ce3\u0cf1\u0cf2\u0d01-\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d-\u0d44\u0d46-\u0d48\u0d4a-\u0d4e\u0d57\u0d60-\u0d63\u0d7a-\u0d7f\u0d82\u0d83\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e01-\u0e3a\u0e40-\u0e4e\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0edc-\u0edf\u0f00\u0f18\u0f19\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f6c\u0f71-\u0f84\u0f86-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u103f\u1050-\u108f\u109a-\u109d\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u135d-\u135f\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16f1-\u16f8\u1700-\u170c\u170e-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176c\u176e-\u1770\u1772\u1773\u1780-\u17d3\u17d7\u17dc\u17dd\u180b-\u180d\u1820-\u1877\u1880-\u18aa\u18b0-\u18f5\u1900-\u191e\u1920-\u192b\u1930-\u193b\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u1a00-\u1a1b\u1a20-\u1a5e\u1a60-\u1a7c\u1a7f\u1aa7\u1ab0-\u1abe\u1b00-\u1b4b\u1b6b-\u1b73\u1b80-\u1baf\u1bba-\u1bf3\u1c00-\u1c37\u1c4d-\u1c4f\u1c5a-\u1c7d\u1cd0-\u1cd2\u1cd4-\u1cf6\u1cf8\u1cf9\u1d00-\u1df5\u1dfc-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u20d0-\u20f0\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2183\u2184\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d7f-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2de0-\u2dff\u2e2f\u3005\u3006\u302a-\u302f\u3031-\u3035\u303b\u303c\u3041-\u3096\u3099\u309a\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua672\ua674-\ua67d\ua67f-\ua69d\ua69f-\ua6e5\ua6f0\ua6f1\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua7ad\ua7b0\ua7b1\ua7f7-\ua827\ua840-\ua873\ua880-\ua8c4\ua8e0-\ua8f7\ua8fb\ua90a-\ua92d\ua930-\ua953\ua960-\ua97c\ua980-\ua9c0\ua9cf\ua9e0-\ua9ef\ua9fa-\ua9fe\uaa00-\uaa36\uaa40-\uaa4d\uaa60-\uaa76\uaa7a-\uaac2\uaadb-\uaadd\uaae0-\uaaef\uaaf2-\uaaf6\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab5f\uab64\uab65\uabc0-\uabea\uabec\uabed\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf870-\uf87f\uf882\uf884-\uf89f\uf8b8\uf8c1-\uf8d6\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe00-\ufe0f\ufe20-\ufe2d\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc0-9\u0660-\u0669\u06f0-\u06f9\u07c0-\u07c9\u0966-\u096f\u09e6-\u09ef\u0a66-\u0a6f\u0ae6-\u0aef\u0b66-\u0b6f\u0be6-\u0bef\u0c66-\u0c6f\u0ce6-\u0cef\u0d66-\u0d6f\u0de6-\u0def\u0e50-\u0e59\u0ed0-\u0ed9\u0f20-\u0f29\u1040-\u1049\u1090-\u1099\u17e0-\u17e9\u1810-\u1819\u1946-\u194f\u19d0-\u19d9\u1a80-\u1a89\u1a90-\u1a99\u1b50-\u1b59\u1bb0-\u1bb9\u1c40-\u1c49\u1c50-\u1c59\ua620-\ua629\ua8d0-\ua8d9\ua900-\ua909\ua9d0-\ua9d9\ua9f0-\ua9f9\uaa50-\uaa59\uabf0-\uabf9\uff10-\uff19_\u200c\u200d\ua67e\u05be\u05f3\u05f4\uff5e\u301c\u309b\u309c\u30a0\u30fb\u3003\u0f0b\u0f0c\xb7]|\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]|(?=[\uD800-\uDBFF][\uDC00-\uDFFF])(?:\ud800[\udc00-\udc0b\udc0d-\udc26\udc28-\udc3a\udc3c\udc3d\udc3f-\udc4d\udc50-\udc5d\udc80-\udcfa\uddfd\ude80-\ude9c\udea0-\uded0\udee0\udf00-\udf1f\udf30-\udf40\udf42-\udf49\udf50-\udf7a\udf80-\udf9d\udfa0-\udfc3\udfc8-\udfcf]|\ud801[\udc00-\udc9d\udd00-\udd27\udd30-\udd63\ude00-\udf36\udf40-\udf55\udf60-\udf67]|\ud802[\udc00-\udc05\udc08\udc0a-\udc35\udc37\udc38\udc3c\udc3f-\udc55\udc60-\udc76\udc80-\udc9e\udd00-\udd15\udd20-\udd39\udd80-\uddb7\uddbe\uddbf\ude00-\ude03\ude05\ude06\ude0c-\ude13\ude15-\ude17\ude19-\ude33\ude38-\ude3a\ude3f\ude60-\ude7c\ude80-\ude9c\udec0-\udec7\udec9-\udee6\udf00-\udf35\udf40-\udf55\udf60-\udf72\udf80-\udf91]|\ud803[\udc00-\udc48]|\ud804[\udc00-\udc46\udc7f-\udcba\udcd0-\udce8\udd00-\udd34\udd50-\udd73\udd76\udd80-\uddc4\uddda\ude00-\ude11\ude13-\ude37\udeb0-\udeea\udf01-\udf03\udf05-\udf0c\udf0f\udf10\udf13-\udf28\udf2a-\udf30\udf32\udf33\udf35-\udf39\udf3c-\udf44\udf47\udf48\udf4b-\udf4d\udf57\udf5d-\udf63\udf66-\udf6c\udf70-\udf74]|\ud805[\udc80-\udcc5\udcc7\udd80-\uddb5\uddb8-\uddc0\ude00-\ude40\ude44\ude80-\udeb7]|\ud806[\udca0-\udcdf\udcff\udec0-\udef8]|\ud808[\udc00-\udf98]|\ud80c[\udc00-\udfff]|\ud80d[\udc00-\udc2e]|\ud81a[\udc00-\ude38\ude40-\ude5e\uded0-\udeed\udef0-\udef4\udf00-\udf36\udf40-\udf43\udf63-\udf77\udf7d-\udf8f]|\ud81b[\udf00-\udf44\udf50-\udf7e\udf8f-\udf9f]|\ud82c[\udc00\udc01]|\ud82f[\udc00-\udc6a\udc70-\udc7c\udc80-\udc88\udc90-\udc99\udc9d\udc9e]|\ud834[\udd65-\udd69\udd6d-\udd72\udd7b-\udd82\udd85-\udd8b\uddaa-\uddad\ude42-\ude44]|\ud835[\udc00-\udc54\udc56-\udc9c\udc9e\udc9f\udca2\udca5\udca6\udca9-\udcac\udcae-\udcb9\udcbb\udcbd-\udcc3\udcc5-\udd05\udd07-\udd0a\udd0d-\udd14\udd16-\udd1c\udd1e-\udd39\udd3b-\udd3e\udd40-\udd44\udd46\udd4a-\udd50\udd52-\udea5\udea8-\udec0\udec2-\udeda\udedc-\udefa\udefc-\udf14\udf16-\udf34\udf36-\udf4e\udf50-\udf6e\udf70-\udf88\udf8a-\udfa8\udfaa-\udfc2\udfc4-\udfcb]|\ud83a[\udc00-\udcc4\udcd0-\udcd6]|\ud83b[\ude00-\ude03\ude05-\ude1f\ude21\ude22\ude24\ude27\ude29-\ude32\ude34-\ude37\ude39\ude3b\ude42\ude47\ude49\ude4b\ude4d-\ude4f\ude51\ude52\ude54\ude57\ude59\ude5b\ude5d\ude5f\ude61\ude62\ude64\ude67-\ude6a\ude6c-\ude72\ude74-\ude77\ude79-\ude7c\ude7e\ude80-\ude89\ude8b-\ude9b\udea1-\udea3\udea5-\udea9\udeab-\udebb]|\ud840[\udc00-\udfff]|\ud841[\udc00-\udfff]|\ud842[\udc00-\udfff]|\ud843[\udc00-\udfff]|\ud844[\udc00-\udfff]|\ud845[\udc00-\udfff]|\ud846[\udc00-\udfff]|\ud847[\udc00-\udfff]|\ud848[\udc00-\udfff]|\ud849[\udc00-\udfff]|\ud84a[\udc00-\udfff]|\ud84b[\udc00-\udfff]|\ud84c[\udc00-\udfff]|\ud84d[\udc00-\udfff]|\ud84e[\udc00-\udfff]|\ud84f[\udc00-\udfff]|\ud850[\udc00-\udfff]|\ud851[\udc00-\udfff]|\ud852[\udc00-\udfff]|\ud853[\udc00-\udfff]|\ud854[\udc00-\udfff]|\ud855[\udc00-\udfff]|\ud856[\udc00-\udfff]|\ud857[\udc00-\udfff]|\ud858[\udc00-\udfff]|\ud859[\udc00-\udfff]|\ud85a[\udc00-\udfff]|\ud85b[\udc00-\udfff]|\ud85c[\udc00-\udfff]|\ud85d[\udc00-\udfff]|\ud85e[\udc00-\udfff]|\ud85f[\udc00-\udfff]|\ud860[\udc00-\udfff]|\ud861[\udc00-\udfff]|\ud862[\udc00-\udfff]|\ud863[\udc00-\udfff]|\ud864[\udc00-\udfff]|\ud865[\udc00-\udfff]|\ud866[\udc00-\udfff]|\ud867[\udc00-\udfff]|\ud868[\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|\ud86a[\udc00-\udfff]|\ud86b[\udc00-\udfff]|\ud86c[\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]|\ud87e[\udc00-\ude1d]|\udb40[\udd00-\uddef]|\ud801[\udca0-\udca9]|\ud804[\udc66-\udc6f\udcf0-\udcf9\udd36-\udd3f\uddd0-\uddd9\udef0-\udef9]|\ud805[\udcd0-\udcd9\ude50-\ude59\udec0-\udec9]|\ud806[\udce0-\udce9]|\ud81a[\ude60-\ude69\udf50-\udf59]|\ud835[\udfce-\udfff]))|&)(?:[^\uD800-\uDFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF])))([\/@#＃])(?!\uFE0F|\u20E3)((?:[A-Za-z\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0300-\u0374\u0376\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u0483-\u052f\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u05d0-\u05ea\u05f0-\u05f2\u0610-\u061a\u0620-\u065f\u066e-\u06d3\u06d5-\u06dc\u06df-\u06e8\u06ea-\u06ef\u06fa-\u06fc\u06ff\u0710-\u074a\u074d-\u07b1\u07ca-\u07f5\u07fa\u0800-\u082d\u0840-\u085b\u08a0-\u08b2\u08e4-\u0963\u0971-\u0983\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bc-\u09c4\u09c7\u09c8\u09cb-\u09ce\u09d7\u09dc\u09dd\u09df-\u09e3\u09f0\u09f1\u0a01-\u0a03\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a59-\u0a5c\u0a5e\u0a70-\u0a75\u0a81-\u0a83\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abc-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0-\u0ae3\u0b01-\u0b03\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3c-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5c\u0b5d\u0b5f-\u0b63\u0b71\u0b82\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd0\u0bd7\u0c00-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c58\u0c59\u0c60-\u0c63\u0c81-\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbc-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0cde\u0ce0-\u0ce3\u0cf1\u0cf2\u0d01-\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d-\u0d44\u0d46-\u0d48\u0d4a-\u0d4e\u0d57\u0d60-\u0d63\u0d7a-\u0d7f\u0d82\u0d83\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e01-\u0e3a\u0e40-\u0e4e\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0edc-\u0edf\u0f00\u0f18\u0f19\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f6c\u0f71-\u0f84\u0f86-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u103f\u1050-\u108f\u109a-\u109d\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u135d-\u135f\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16f1-\u16f8\u1700-\u170c\u170e-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176c\u176e-\u1770\u1772\u1773\u1780-\u17d3\u17d7\u17dc\u17dd\u180b-\u180d\u1820-\u1877\u1880-\u18aa\u18b0-\u18f5\u1900-\u191e\u1920-\u192b\u1930-\u193b\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u1a00-\u1a1b\u1a20-\u1a5e\u1a60-\u1a7c\u1a7f\u1aa7\u1ab0-\u1abe\u1b00-\u1b4b\u1b6b-\u1b73\u1b80-\u1baf\u1bba-\u1bf3\u1c00-\u1c37\u1c4d-\u1c4f\u1c5a-\u1c7d\u1cd0-\u1cd2\u1cd4-\u1cf6\u1cf8\u1cf9\u1d00-\u1df5\u1dfc-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u20d0-\u20f0\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2183\u2184\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d7f-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2de0-\u2dff\u2e2f\u3005\u3006\u302a-\u302f\u3031-\u3035\u303b\u303c\u3041-\u3096\u3099\u309a\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua672\ua674-\ua67d\ua67f-\ua69d\ua69f-\ua6e5\ua6f0\ua6f1\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua7ad\ua7b0\ua7b1\ua7f7-\ua827\ua840-\ua873\ua880-\ua8c4\ua8e0-\ua8f7\ua8fb\ua90a-\ua92d\ua930-\ua953\ua960-\ua97c\ua980-\ua9c0\ua9cf\ua9e0-\ua9ef\ua9fa-\ua9fe\uaa00-\uaa36\uaa40-\uaa4d\uaa60-\uaa76\uaa7a-\uaac2\uaadb-\uaadd\uaae0-\uaaef\uaaf2-\uaaf6\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab5f\uab64\uab65\uabc0-\uabea\uabec\uabed\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf870-\uf87f\uf882\uf884-\uf89f\uf8b8\uf8c1-\uf8d6\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe00-\ufe0f\ufe20-\ufe2d\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc0-9\u0660-\u0669\u06f0-\u06f9\u07c0-\u07c9\u0966-\u096f\u09e6-\u09ef\u0a66-\u0a6f\u0ae6-\u0aef\u0b66-\u0b6f\u0be6-\u0bef\u0c66-\u0c6f\u0ce6-\u0cef\u0d66-\u0d6f\u0de6-\u0def\u0e50-\u0e59\u0ed0-\u0ed9\u0f20-\u0f29\u1040-\u1049\u1090-\u1099\u17e0-\u17e9\u1810-\u1819\u1946-\u194f\u19d0-\u19d9\u1a80-\u1a89\u1a90-\u1a99\u1b50-\u1b59\u1bb0-\u1bb9\u1c40-\u1c49\u1c50-\u1c59\ua620-\ua629\ua8d0-\ua8d9\ua900-\ua909\ua9d0-\ua9d9\ua9f0-\ua9f9\uaa50-\uaa59\uabf0-\uabf9\uff10-\uff19_\u200c\u200d\ua67e\u05be\u05f3\u05f4\uff5e\u301c\u309b\u309c\u30a0\u30fb\u3003\u0f0b\u0f0c\xb7]|\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]|(?=[\uD800-\uDBFF][\uDC00-\uDFFF])(?:\ud800[\udc00-\udc0b\udc0d-\udc26\udc28-\udc3a\udc3c\udc3d\udc3f-\udc4d\udc50-\udc5d\udc80-\udcfa\uddfd\ude80-\ude9c\udea0-\uded0\udee0\udf00-\udf1f\udf30-\udf40\udf42-\udf49\udf50-\udf7a\udf80-\udf9d\udfa0-\udfc3\udfc8-\udfcf]|\ud801[\udc00-\udc9d\udd00-\udd27\udd30-\udd63\ude00-\udf36\udf40-\udf55\udf60-\udf67]|\ud802[\udc00-\udc05\udc08\udc0a-\udc35\udc37\udc38\udc3c\udc3f-\udc55\udc60-\udc76\udc80-\udc9e\udd00-\udd15\udd20-\udd39\udd80-\uddb7\uddbe\uddbf\ude00-\ude03\ude05\ude06\ude0c-\ude13\ude15-\ude17\ude19-\ude33\ude38-\ude3a\ude3f\ude60-\ude7c\ude80-\ude9c\udec0-\udec7\udec9-\udee6\udf00-\udf35\udf40-\udf55\udf60-\udf72\udf80-\udf91]|\ud803[\udc00-\udc48]|\ud804[\udc00-\udc46\udc7f-\udcba\udcd0-\udce8\udd00-\udd34\udd50-\udd73\udd76\udd80-\uddc4\uddda\ude00-\ude11\ude13-\ude37\udeb0-\udeea\udf01-\udf03\udf05-\udf0c\udf0f\udf10\udf13-\udf28\udf2a-\udf30\udf32\udf33\udf35-\udf39\udf3c-\udf44\udf47\udf48\udf4b-\udf4d\udf57\udf5d-\udf63\udf66-\udf6c\udf70-\udf74]|\ud805[\udc80-\udcc5\udcc7\udd80-\uddb5\uddb8-\uddc0\ude00-\ude40\ude44\ude80-\udeb7]|\ud806[\udca0-\udcdf\udcff\udec0-\udef8]|\ud808[\udc00-\udf98]|\ud80c[\udc00-\udfff]|\ud80d[\udc00-\udc2e]|\ud81a[\udc00-\ude38\ude40-\ude5e\uded0-\udeed\udef0-\udef4\udf00-\udf36\udf40-\udf43\udf63-\udf77\udf7d-\udf8f]|\ud81b[\udf00-\udf44\udf50-\udf7e\udf8f-\udf9f]|\ud82c[\udc00\udc01]|\ud82f[\udc00-\udc6a\udc70-\udc7c\udc80-\udc88\udc90-\udc99\udc9d\udc9e]|\ud834[\udd65-\udd69\udd6d-\udd72\udd7b-\udd82\udd85-\udd8b\uddaa-\uddad\ude42-\ude44]|\ud835[\udc00-\udc54\udc56-\udc9c\udc9e\udc9f\udca2\udca5\udca6\udca9-\udcac\udcae-\udcb9\udcbb\udcbd-\udcc3\udcc5-\udd05\udd07-\udd0a\udd0d-\udd14\udd16-\udd1c\udd1e-\udd39\udd3b-\udd3e\udd40-\udd44\udd46\udd4a-\udd50\udd52-\udea5\udea8-\udec0\udec2-\udeda\udedc-\udefa\udefc-\udf14\udf16-\udf34\udf36-\udf4e\udf50-\udf6e\udf70-\udf88\udf8a-\udfa8\udfaa-\udfc2\udfc4-\udfcb]|\ud83a[\udc00-\udcc4\udcd0-\udcd6]|\ud83b[\ude00-\ude03\ude05-\ude1f\ude21\ude22\ude24\ude27\ude29-\ude32\ude34-\ude37\ude39\ude3b\ude42\ude47\ude49\ude4b\ude4d-\ude4f\ude51\ude52\ude54\ude57\ude59\ude5b\ude5d\ude5f\ude61\ude62\ude64\ude67-\ude6a\ude6c-\ude72\ude74-\ude77\ude79-\ude7c\ude7e\ude80-\ude89\ude8b-\ude9b\udea1-\udea3\udea5-\udea9\udeab-\udebb]|\ud840[\udc00-\udfff]|\ud841[\udc00-\udfff]|\ud842[\udc00-\udfff]|\ud843[\udc00-\udfff]|\ud844[\udc00-\udfff]|\ud845[\udc00-\udfff]|\ud846[\udc00-\udfff]|\ud847[\udc00-\udfff]|\ud848[\udc00-\udfff]|\ud849[\udc00-\udfff]|\ud84a[\udc00-\udfff]|\ud84b[\udc00-\udfff]|\ud84c[\udc00-\udfff]|\ud84d[\udc00-\udfff]|\ud84e[\udc00-\udfff]|\ud84f[\udc00-\udfff]|\ud850[\udc00-\udfff]|\ud851[\udc00-\udfff]|\ud852[\udc00-\udfff]|\ud853[\udc00-\udfff]|\ud854[\udc00-\udfff]|\ud855[\udc00-\udfff]|\ud856[\udc00-\udfff]|\ud857[\udc00-\udfff]|\ud858[\udc00-\udfff]|\ud859[\udc00-\udfff]|\ud85a[\udc00-\udfff]|\ud85b[\udc00-\udfff]|\ud85c[\udc00-\udfff]|\ud85d[\udc00-\udfff]|\ud85e[\udc00-\udfff]|\ud85f[\udc00-\udfff]|\ud860[\udc00-\udfff]|\ud861[\udc00-\udfff]|\ud862[\udc00-\udfff]|\ud863[\udc00-\udfff]|\ud864[\udc00-\udfff]|\ud865[\udc00-\udfff]|\ud866[\udc00-\udfff]|\ud867[\udc00-\udfff]|\ud868[\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|\ud86a[\udc00-\udfff]|\ud86b[\udc00-\udfff]|\ud86c[\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]|\ud87e[\udc00-\ude1d]|\udb40[\udd00-\uddef]|\ud801[\udca0-\udca9]|\ud804[\udc66-\udc6f\udcf0-\udcf9\udd36-\udd3f\uddd0-\uddd9\udef0-\udef9]|\ud805[\udcd0-\udcd9\ude50-\ude59\udec0-\udec9]|\ud806[\udce0-\udce9]|\ud81a[\ude60-\ude69\udf50-\udf59]|\ud835[\udfce-\udfff]))+)/gi;

// move (first) hashtag from location to tag if tag is currently emtpy or disabled
if(Lockr.get('LocationOn') && (!Lockr.get('NametagOn') || !Lockr.get('Nametag'))) {
    var loc = Lockr.get('LocationName') || Lockr.get('LocationCity');
    var tag = Lockr.get('Nametag');
    if(!Lockr.get('NametagOn')) tag = '';
    if(loc && !tag) {
      var newTag = '';
      var newLoc = loc.replace(hashtagRE, function(match, before, hash, hashText, offset, chunk) {
        if(hash != '#' || newTag) return before + hash + hashText;
        newTag = '#'+hashText;
        return before.trim();
      });
      if(newTag) {
        Lockr.set('NametagOn', true);
        Lockr.set('Nametag', newTag);
        Lockr.set('LocationName', newLoc.trim());
        Lockr.set('LocationCity', newLoc.trim());
        if(!newLoc.trim()) {
          Lockr.set('LocationOn', false);
        }
      }
    }
}
