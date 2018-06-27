'use strict';

var ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/redirect-redirect-redirect.xml';

describe("Test for MaximumRedirectSpec", function () {

  var id = 'rmpPlayer';
  var container = document.getElementById(id);
  var video = document.querySelector('.rmp-video');
  var params = {
    maxNumRedirects: 2
  };
  var rmpVast = new RmpVast(id, params);
  var fw = rmpVast.getFW();
  var env = rmpVast.getEnv();
  var ua = window.navigator.userAgent;
  var regExp = /(edge\/|firefox\/)/i;
  if (!regExp.test(ua)) {
    video.muted = true;
  }
  if (env.isAndroid[0]) {
    container.style.width = '320px';
    container.style.height = '180px';
  }
  var title = document.getElementsByTagName('title')[0];

  it("should load adTag and trigger an error", function (done) {
    var validSteps = 0;

    var _incrementAndLog = function (event) {
      validSteps++;
      if (event && event.type) {
        fw.log(event.type);
      }
    };

    container.addEventListener('adtagloaded', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('adfollowingredirect', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('aderror', function (e) {
      _incrementAndLog(e);
      expect(rmpVast.getAdVastErrorCode()).toBe(302);
    });

    container.addEventListener('addestroyed', function (e) {
      _incrementAndLog(e);
      expect(validSteps).toBe(8);
      if (validSteps === 8) {
        title.textContent = 'Test completed';
      }
      setTimeout(function () {
        done();
      }, 400);
    });

    rmpVast.loadAds(ADTAG);
  });


});
