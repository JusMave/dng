importScripts('common.js');

var _doYadng = function(_yadng) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs && tabs[0];
        if (!tab) return;
        if (_yadng.isSearch) {
            _doSearch(_yadng, tab);
        } else {
            _doLink(_yadng, tab);
        }
    });
};

var _doSearch = function(_yadng, tab) {
    chrome.storage.sync.get(['searchEngines'], function(r) {
        var se = 0;
        if (_yadng.endX > _yadng.startX) {
            se = _yadng.endY > _yadng.startY ? 3 : 1;
        } else {
            se = _yadng.endY > _yadng.startY ? 2 : 0;
        }
        var url;
        if (-1 == r.searchEngines[se].id) {
            url = r.searchEngines[se].url.replace('%s', _yadng.selection);
        } else {
            url = _build_in_seach_engines[r.searchEngines[se].id].url.replace('%s', _yadng.selection);
        }
        chrome.tabs.create({
            'url': url,
            'active': false,
            'index': tab.index + 1
        });
    });
};

var _doLink = function(_yadng, tab) {
    chrome.storage.sync.get(['indexMode', 'selectedMode'], function(r) {
        var ti = tab.index;
        var index = ti + 1;
        if (r.indexMode == '2') {
            index = _yadng.endX > _yadng.startX ? ti + 1 : ti;
        } else {
            index = r.indexMode == '0' ? ti + 1 : ti;
        }
        var selected = false;
        if (r.selectedMode == '2') {
            selected = _yadng.endY > _yadng.startY ? false : true;
        } else {
            selected = r.selectedMode == '0' ? true : false;
        }
        chrome.tabs.create({
            'url': _yadng.selection,
            'active': selected,
            'index': index
        });
    });
};

chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(_doYadng);
});
