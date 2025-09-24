(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.__entrypoint__ = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
require("./admin.less");
var _react = _interopRequireWildcard(require("react"));
var _authorUtils = _interopRequireDefault(require("./authorUtils/authorUtils.jsx"));
var _lockTools = _interopRequireDefault(require("./lockTools/lockTools.jsx"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
var BrewUtils = require('./brewUtils/brewUtils.jsx');
var NotificationUtils = require('./notificationUtils/notificationUtils.jsx');
var tabGroups = ['brew', 'notifications', 'authors', 'locks'];
var Admin = function Admin() {
  var _useState = (0, _react.useState)(''),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    currentTab = _useState2[0],
    setCurrentTab = _useState2[1];
  (0, _react.useEffect)(function () {
    setCurrentTab(localStorage.getItem('hbAdminTab') || 'brew');
  }, []);
  (0, _react.useEffect)(function () {
    localStorage.setItem('hbAdminTab', currentTab);
  }, [currentTab]);
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "admin"
  }, /*#__PURE__*/_react["default"].createElement("header", null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "container"
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "fas fa-rocket"
  }), "The Homebrewery Admin Page", /*#__PURE__*/_react["default"].createElement("a", {
    href: "/"
  }, "back to homepage"))), /*#__PURE__*/_react["default"].createElement("main", {
    className: "container"
  }, /*#__PURE__*/_react["default"].createElement("nav", {
    className: "tabs"
  }, tabGroups.map(function (tab, idx) {
    return /*#__PURE__*/_react["default"].createElement("button", {
      className: tab === currentTab ? 'active' : '',
      key: idx,
      onClick: function onClick() {
        return setCurrentTab(tab);
      }
    }, tab.toUpperCase());
  })), currentTab === 'brew' && /*#__PURE__*/_react["default"].createElement(BrewUtils, null), currentTab === 'notifications' && /*#__PURE__*/_react["default"].createElement(NotificationUtils, null), currentTab === 'authors' && /*#__PURE__*/_react["default"].createElement(_authorUtils["default"], null), currentTab === 'locks' && /*#__PURE__*/_react["default"].createElement(_lockTools["default"], null)));
};
module.exports = Admin;
},{"./admin.less":2,"./authorUtils/authorUtils.jsx":5,"./brewUtils/brewUtils.jsx":9,"./lockTools/lockTools.jsx":12,"./notificationUtils/notificationUtils.jsx":18,"@babel/runtime/helpers/interopRequireDefault":24,"@babel/runtime/helpers/slicedToArray":35,"@babel/runtime/helpers/typeof":36,"react":"react"}],2:[function(require,module,exports){
module.exports = '';
},{}],3:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
require("./authorLookup.less");
var _react = _interopRequireDefault(require("react"));
var _superagent = _interopRequireDefault(require("superagent"));
var authorLookup = function authorLookup() {
  var _React$useState = _react["default"].useState(''),
    _React$useState2 = (0, _slicedToArray2["default"])(_React$useState, 2),
    author = _React$useState2[0],
    setAuthor = _React$useState2[1];
  var _React$useState3 = _react["default"].useState(false),
    _React$useState4 = (0, _slicedToArray2["default"])(_React$useState3, 2),
    searching = _React$useState4[0],
    setSearching = _React$useState4[1];
  var _React$useState5 = _react["default"].useState([]),
    _React$useState6 = (0, _slicedToArray2["default"])(_React$useState5, 2),
    results = _React$useState6[0],
    setResults = _React$useState6[1];
  var lookup = /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var brews;
      return _regenerator["default"].wrap(function (_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (author) {
              _context.next = 1;
              break;
            }
            return _context.abrupt("return");
          case 1:
            setSearching(true);
            setResults([]);
            _context.next = 2;
            return _superagent["default"].get("/admin/user/list/".concat(author));
          case 2:
            brews = _context.sent;
            setResults(brews.body);
            setSearching(false);
          case 3:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function lookup() {
      return _ref.apply(this, arguments);
    };
  }();
  var renderResults = function renderResults() {
    if (results.length == 0) return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("h2", null, "Results"), /*#__PURE__*/_react["default"].createElement("p", null, "None found."));
    return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("h2", null, "Results - ".concat(results.length, " brews")), /*#__PURE__*/_react["default"].createElement("table", {
      className: "resultsTable"
    }, /*#__PURE__*/_react["default"].createElement("thead", null, /*#__PURE__*/_react["default"].createElement("tr", null, /*#__PURE__*/_react["default"].createElement("th", null, "Title"), /*#__PURE__*/_react["default"].createElement("th", null, "Share"), /*#__PURE__*/_react["default"].createElement("th", null, "Edit"), /*#__PURE__*/_react["default"].createElement("th", null, "Last Update"), /*#__PURE__*/_react["default"].createElement("th", null, "Storage"))), /*#__PURE__*/_react["default"].createElement("tbody", null, results.sort(function (a, b) {
      // Sort brews from most recently updated
      if (a.updatedAt > b.updatedAt) return -1;
      return 1;
    }).map(function (brew, idx) {
      return /*#__PURE__*/_react["default"].createElement("tr", {
        key: idx
      }, /*#__PURE__*/_react["default"].createElement("td", null, /*#__PURE__*/_react["default"].createElement("strong", null, brew.title)), /*#__PURE__*/_react["default"].createElement("td", null, /*#__PURE__*/_react["default"].createElement("a", {
        href: "/share/".concat(brew.shareId)
      }, brew.shareId)), /*#__PURE__*/_react["default"].createElement("td", null, brew.editId), /*#__PURE__*/_react["default"].createElement("td", {
        style: {
          width: '200px'
        }
      }, brew.updatedAt), /*#__PURE__*/_react["default"].createElement("td", null, brew.googleId ? 'Google' : 'Homebrewery'));
    }))));
  };
  var handleKeyPress = function handleKeyPress(evt) {
    if (evt.key === 'Enter') return lookup();
  };
  var handleChange = function handleChange(evt) {
    setAuthor(evt.target.value);
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "authorLookup"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "authorLookupInputs"
  }, /*#__PURE__*/_react["default"].createElement("h2", null, "Author Lookup"), /*#__PURE__*/_react["default"].createElement("label", {
    className: "field"
  }, "Author Name:", /*#__PURE__*/_react["default"].createElement("input", {
    className: "fieldInput",
    value: author,
    onKeyDown: handleKeyPress,
    onChange: handleChange
  }), /*#__PURE__*/_react["default"].createElement("button", {
    onClick: lookup
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "fas ".concat(searching ? 'fa-spin fa-spinner' : 'fa-search')
  })))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "authorLookupResults"
  }, renderResults()));
};
module.exports = authorLookup;
},{"./authorLookup.less":4,"@babel/runtime/helpers/asyncToGenerator":23,"@babel/runtime/helpers/interopRequireDefault":24,"@babel/runtime/helpers/slicedToArray":35,"@babel/runtime/regenerator":38,"react":"react","superagent":"superagent"}],4:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],5:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _react = _interopRequireDefault(require("react"));
var _authorLookup = _interopRequireDefault(require("./authorLookup/authorLookup.jsx"));
var authorUtils = function authorUtils() {
  return /*#__PURE__*/_react["default"].createElement("section", {
    className: "authorUtils"
  }, /*#__PURE__*/_react["default"].createElement(_authorLookup["default"], null));
};
module.exports = authorUtils;
},{"./authorLookup/authorLookup.jsx":3,"@babel/runtime/helpers/interopRequireDefault":24,"react":"react"}],6:[function(require,module,exports){
"use strict";

var React = require('react');
var createClass = require('create-react-class');
var request = require('superagent');
var BrewCleanup = createClass({
  displayName: 'BrewCleanup',
  getDefaultProps: function getDefaultProps() {
    return {};
  },
  getInitialState: function getInitialState() {
    return {
      count: 0,
      pending: false,
      primed: false,
      err: null
    };
  },
  prime: function prime() {
    var _this = this;
    this.setState({
      pending: true
    });
    request.get('/admin/cleanup').then(function (res) {
      return _this.setState({
        count: res.body.count,
        primed: true
      });
    })["catch"](function (err) {
      return _this.setState({
        error: err
      });
    })["finally"](function () {
      return _this.setState({
        pending: false
      });
    });
  },
  cleanup: function cleanup() {
    var _this2 = this;
    this.setState({
      pending: true
    });
    request.post('/admin/cleanup').then(function (res) {
      return _this2.setState({
        count: res.body.count
      });
    })["catch"](function (err) {
      return _this2.setState({
        error: err
      });
    })["finally"](function () {
      return _this2.setState({
        pending: false,
        primed: false
      });
    });
  },
  renderPrimed: function renderPrimed() {
    if (!this.state.primed) return;
    if (!this.state.count) {
      return /*#__PURE__*/React.createElement("div", {
        className: "result noBrews"
      }, "No Matching Brews found.");
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "result"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: this.cleanup,
      className: "remove"
    }, this.state.pending ? /*#__PURE__*/React.createElement("i", {
      className: "fas fa-spin fa-spinner"
    }) : /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-times"
    }), " Remove")), /*#__PURE__*/React.createElement("span", null, "Found ", this.state.count, " Brews that could be removed. "));
  },
  render: function render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "brewUtil brewCleanup"
    }, /*#__PURE__*/React.createElement("h2", null, " Brew Cleanup "), /*#__PURE__*/React.createElement("p", null, "Removes very short brews to tidy up the database"), /*#__PURE__*/React.createElement("button", {
      onClick: this.prime,
      className: "query"
    }, this.state.pending ? /*#__PURE__*/React.createElement("i", {
      className: "fas fa-spin fa-spinner"
    }) : 'Query Brews'), this.renderPrimed(), this.state.error && /*#__PURE__*/React.createElement("div", {
      className: "error noBrews"
    }, this.state.error.toString()));
  }
});
module.exports = BrewCleanup;
},{"create-react-class":"create-react-class","react":"react","superagent":"superagent"}],7:[function(require,module,exports){
"use strict";

var React = require('react');
var createClass = require('create-react-class');
var request = require('superagent');
var BrewCompress = createClass({
  displayName: 'BrewCompress',
  getDefaultProps: function getDefaultProps() {
    return {};
  },
  getInitialState: function getInitialState() {
    return {
      count: 0,
      batchRange: 0,
      pending: false,
      primed: false,
      err: null,
      ids: null
    };
  },
  prime: function prime() {
    var _this = this;
    this.setState({
      pending: true
    });
    request.get('/admin/finduncompressed').then(function (res) {
      return _this.setState({
        count: res.body.count,
        primed: true,
        ids: res.body.ids
      });
    })["catch"](function (err) {
      return _this.setState({
        error: err
      });
    })["finally"](function () {
      return _this.setState({
        pending: false
      });
    });
  },
  cleanup: function cleanup() {
    var _this2 = this;
    var brews = this.state.ids;
    var _compressBatches = function compressBatches() {
      if (brews.length == 0) {
        _this2.setState({
          pending: false,
          primed: false
        });
        return;
      }
      var batch = brews.splice(0, 1000); // Process brews in batches of 1000
      _this2.setState({
        batchRange: _this2.state.count - brews.length
      });
      batch.forEach(function (id, idx) {
        request.put("/admin/compress/".concat(id))["catch"](function (err) {
          return _this2.setState({
            error: err
          });
        });
      });
      setTimeout(_compressBatches, 10000); //Wait 10 seconds between batches
    };
    this.setState({
      pending: true
    });
    _compressBatches();
  },
  renderPrimed: function renderPrimed() {
    if (!this.state.primed) return;
    if (!this.state.count) {
      return /*#__PURE__*/React.createElement("div", {
        className: "result noBrews"
      }, "No Matching Brews found.");
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "result"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: this.cleanup,
      className: "remove"
    }, this.state.pending ? /*#__PURE__*/React.createElement("i", {
      className: "fas fa-spin fa-spinner"
    }) : /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-compress"
    }), " compress ")), this.state.pending ? /*#__PURE__*/React.createElement("span", null, "Compressing ", this.state.batchRange, " brews. ") : /*#__PURE__*/React.createElement("span", null, "Found ", this.state.count, " Brews that could be compressed. "));
  },
  render: function render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "brewUtil brewCompress"
    }, /*#__PURE__*/React.createElement("h2", null, " Brew Compression "), /*#__PURE__*/React.createElement("p", null, "Compresses the text in brews to binary"), /*#__PURE__*/React.createElement("button", {
      onClick: this.prime,
      className: "query"
    }, this.state.pending ? /*#__PURE__*/React.createElement("i", {
      className: "fas fa-spin fa-spinner"
    }) : 'Query Brews'), this.renderPrimed(), this.state.error && /*#__PURE__*/React.createElement("div", {
      className: "error"
    }, this.state.error.toString()));
  }
});
module.exports = BrewCompress;
},{"create-react-class":"create-react-class","react":"react","superagent":"superagent"}],8:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var React = require('react');
var createClass = require('create-react-class');
var cx = require('classnames');
var request = require('superagent');
var Moment = require('moment');
var BrewLookup = createClass({
  getDefaultProps: function getDefaultProps() {
    return {};
  },
  getInitialState: function getInitialState() {
    return {
      query: '',
      foundBrew: null,
      searching: false,
      error: null,
      scriptCount: 0
    };
  },
  handleChange: function handleChange(e) {
    this.setState({
      query: e.target.value
    });
  },
  lookup: function lookup() {
    var _this = this;
    this.setState({
      searching: true,
      error: null,
      scriptCount: 0
    });
    request.get("/admin/lookup/".concat(this.state.query)).then(function (res) {
      var foundBrew = res.body;
      var scriptCheck = foundBrew === null || foundBrew === void 0 ? void 0 : foundBrew.text.match(/(<\/?s)cript/g);
      _this.setState({
        foundBrew: foundBrew,
        scriptCount: (scriptCheck === null || scriptCheck === void 0 ? void 0 : scriptCheck.length) || 0
      });
    })["catch"](function (err) {
      return _this.setState({
        error: err
      });
    })["finally"](function () {
      _this.setState({
        searching: false
      });
    });
  },
  cleanScript: function cleanScript() {
    var _this2 = this;
    return (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var _this2$state$foundBre;
      return _regenerator["default"].wrap(function (_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if ((_this2$state$foundBre = _this2.state.foundBrew) !== null && _this2$state$foundBre !== void 0 && _this2$state$foundBre.shareId) {
              _context.next = 1;
              break;
            }
            return _context.abrupt("return");
          case 1:
            _context.next = 2;
            return request.put("/admin/clean/script/".concat(_this2.state.foundBrew.shareId))["catch"](function (err) {
              _this2.setState({
                error: err
              });
              return;
            });
          case 2:
            _this2.lookup();
          case 3:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }))();
  },
  renderFoundBrew: function renderFoundBrew() {
    var brew = this.state.foundBrew;
    return /*#__PURE__*/React.createElement("div", {
      className: "result"
    }, /*#__PURE__*/React.createElement("dl", null, /*#__PURE__*/React.createElement("dt", null, "Title"), /*#__PURE__*/React.createElement("dd", null, brew.title), /*#__PURE__*/React.createElement("dt", null, "Authors"), /*#__PURE__*/React.createElement("dd", null, brew.authors.join(', ')), /*#__PURE__*/React.createElement("dt", null, "Edit Link"), /*#__PURE__*/React.createElement("dd", null, /*#__PURE__*/React.createElement("a", {
      href: "/edit/".concat(brew.editId),
      target: "_blank",
      rel: "noopener noreferrer"
    }, "/edit/", brew.editId)), /*#__PURE__*/React.createElement("dt", null, "Share Link"), /*#__PURE__*/React.createElement("dd", null, /*#__PURE__*/React.createElement("a", {
      href: "/share/".concat(brew.shareId),
      target: "_blank",
      rel: "noopener noreferrer"
    }, "/share/", brew.shareId)), /*#__PURE__*/React.createElement("dt", null, "Created Time"), /*#__PURE__*/React.createElement("dd", null, brew.createdAt ? Moment(brew.createdAt).toLocaleString() : 'No creation date'), /*#__PURE__*/React.createElement("dt", null, "Last Updated"), /*#__PURE__*/React.createElement("dd", null, Moment(brew.updatedAt).fromNow()), /*#__PURE__*/React.createElement("dt", null, "Num of Views"), /*#__PURE__*/React.createElement("dd", null, brew.views), /*#__PURE__*/React.createElement("dt", null, "SCRIPT tags detected"), /*#__PURE__*/React.createElement("dd", null, this.state.scriptCount)), this.state.scriptCount > 0 && /*#__PURE__*/React.createElement("div", {
      className: "cleanButton"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: this.cleanScript
    }, "CLEAN BREW")));
  },
  render: function render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "brewUtil brewLookup"
    }, /*#__PURE__*/React.createElement("h2", null, "Brew Lookup"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: this.state.query,
      onChange: this.handleChange,
      placeholder: "edit or share id"
    }), /*#__PURE__*/React.createElement("button", {
      onClick: this.lookup
    }, /*#__PURE__*/React.createElement("i", {
      className: cx('fas', {
        'fa-search': !this.state.searching,
        'fa-spin fa-spinner': this.state.searching
      })
    })), this.state.error && /*#__PURE__*/React.createElement("div", {
      className: "error"
    }, this.state.error.toString()), this.state.foundBrew ? this.renderFoundBrew() : /*#__PURE__*/React.createElement("div", {
      className: "result noBrew"
    }, "No brew found."));
  }
});
module.exports = BrewLookup;
},{"@babel/runtime/helpers/asyncToGenerator":23,"@babel/runtime/helpers/interopRequireDefault":24,"@babel/runtime/regenerator":38,"classnames":"classnames","create-react-class":"create-react-class","moment":"moment","react":"react","superagent":"superagent"}],9:[function(require,module,exports){
"use strict";

var React = require('react');
var createClass = require('create-react-class');
require('./brewUtils.less');
var BrewCleanup = require('./brewCleanup/brewCleanup.jsx');
var BrewLookup = require('./brewLookup/brewLookup.jsx');
var BrewCompress = require('./brewCompress/brewCompress.jsx');
var Stats = require('./stats/stats.jsx');
var BrewUtils = createClass({
  render: function render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Stats, null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(BrewLookup, null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(BrewCleanup, null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(BrewCompress, null));
  }
});
module.exports = BrewUtils;
},{"./brewCleanup/brewCleanup.jsx":6,"./brewCompress/brewCompress.jsx":7,"./brewLookup/brewLookup.jsx":8,"./brewUtils.less":10,"./stats/stats.jsx":11,"create-react-class":"create-react-class","react":"react"}],10:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],11:[function(require,module,exports){
"use strict";

var React = require('react');
var createClass = require('create-react-class');
var request = require('superagent');
var Stats = createClass({
  displayName: 'Stats',
  getDefaultProps: function getDefaultProps() {
    return {};
  },
  getInitialState: function getInitialState() {
    return {
      stats: {
        totalBrews: 0,
        totalPublishedBrews: 0
      },
      fetching: false
    };
  },
  componentDidMount: function componentDidMount() {
    this.fetchStats();
  },
  fetchStats: function fetchStats() {
    var _this = this;
    this.setState({
      fetching: true
    });
    request.get('/admin/stats').then(function (res) {
      return _this.setState({
        stats: res.body
      });
    })["finally"](function () {
      return _this.setState({
        fetching: false
      });
    });
  },
  render: function render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "brewUtil stats"
    }, /*#__PURE__*/React.createElement("h2", null, " Stats "), /*#__PURE__*/React.createElement("dl", null, /*#__PURE__*/React.createElement("dt", null, "Total Brew Count"), /*#__PURE__*/React.createElement("dd", null, this.state.stats.totalBrews), /*#__PURE__*/React.createElement("dt", null, "Total Brews Published"), /*#__PURE__*/React.createElement("dd", null, this.state.stats.totalPublishedBrews)), this.state.fetching && /*#__PURE__*/React.createElement("div", {
      className: "pending"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-spin fa-spinner"
    })));
  }
});
module.exports = Stats;
},{"create-react-class":"create-react-class","react":"react","superagent":"superagent"}],12:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _requestMiddleware = _interopRequireDefault(require("../../homebrew/utils/request-middleware.js"));
/*eslint max-lines: ["warn", {"max": 500, "skipBlankLines": true, "skipComments": true}]*/
require('./lockTools.less');
var React = require('react');
var createClass = require('create-react-class');
var LockTools = createClass({
  displayName: 'LockTools',
  getInitialState: function getInitialState() {
    return {
      fetching: false,
      reviewCount: 0
    };
  },
  componentDidMount: function componentDidMount() {
    this.updateReviewCount();
  },
  updateReviewCount: function () {
    var _updateReviewCount = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var newCount;
      return _regenerator["default"].wrap(function (_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 1;
            return _requestMiddleware["default"].get('/api/lock/count').then(function (res) {
              var _res$body;
              return ((_res$body = res.body) === null || _res$body === void 0 ? void 0 : _res$body.count) || 'Unknown';
            });
          case 1:
            newCount = _context.sent;
            if (newCount != this.state.reviewCount) {
              this.setState({
                reviewCount: newCount
              });
            }
          case 2:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));
    function updateReviewCount() {
      return _updateReviewCount.apply(this, arguments);
    }
    return updateReviewCount;
  }(),
  updateLockData: function updateLockData(lock) {
    this.setState({
      lock: lock
    });
  },
  render: function render() {
    var _this$state$lock;
    return /*#__PURE__*/React.createElement("div", {
      className: "lockTools"
    }, /*#__PURE__*/React.createElement("h2", null, "Lock Count"), /*#__PURE__*/React.createElement("p", null, "Number of brews currently locked: ", this.state.reviewCount), /*#__PURE__*/React.createElement("button", {
      onClick: this.updateReviewCount
    }, "REFRESH"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(LockTable, {
      title: "Locked Brews",
      text: "Total Locked Brews",
      resultName: "lockedDocuments",
      fetchURL: "/api/locks",
      propertyNames: ['shareId', 'title'],
      loadBrew: this.updateLockData
    }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(LockTable, {
      title: "Brews Awaiting Review",
      text: "Total Reviews Waiting",
      resultName: "reviewDocuments",
      fetchURL: "/api/lock/reviews",
      propertyNames: ['shareId', 'title'],
      loadBrew: this.updateLockData
    }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(LockBrew, {
      key: ((_this$state$lock = this.state.lock) === null || _this$state$lock === void 0 ? void 0 : _this$state$lock.key) || 0,
      lock: this.state.lock
    }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("div", {
      style: {
        columns: 2
      }
    }, /*#__PURE__*/React.createElement(LockLookup, {
      title: "Unlock Brew",
      fetchURL: "/api/unlock",
      updateFn: this.updateReviewCount
    }), /*#__PURE__*/React.createElement(LockLookup, {
      title: "Clear Review Request",
      fetchURL: "/api/lock/review/remove"
    })), /*#__PURE__*/React.createElement("hr", null));
  }
});
var LockBrew = createClass({
  displayName: 'LockBrew',
  getInitialState: function getInitialState() {
    var _this$props$lock, _this$props$lock2, _this$props$lock3, _this$props$lock4;
    // Default values
    return {
      brewId: ((_this$props$lock = this.props.lock) === null || _this$props$lock === void 0 ? void 0 : _this$props$lock.shareId) || '',
      code: ((_this$props$lock2 = this.props.lock) === null || _this$props$lock2 === void 0 ? void 0 : _this$props$lock2.code) || 455,
      editMessage: ((_this$props$lock3 = this.props.lock) === null || _this$props$lock3 === void 0 ? void 0 : _this$props$lock3.editMessage) || '',
      shareMessage: ((_this$props$lock4 = this.props.lock) === null || _this$props$lock4 === void 0 ? void 0 : _this$props$lock4.shareMessage) || 'This Brew has been locked.',
      result: {},
      overwrite: false
    };
  },
  handleChange: function handleChange(e, varName) {
    var output = {};
    output[varName] = e.target.value;
    this.setState(output);
  },
  submit: function submit(e) {
    var _this = this;
    e.preventDefault();
    if (!this.state.editMessage) return;
    var newLock = {
      overwrite: this.state.overwrite,
      code: parseInt(this.state.code) || 100,
      editMessage: this.state.editMessage,
      shareMessage: this.state.shareMessage,
      applied: new Date()
    };
    _requestMiddleware["default"].post("/api/lock/".concat(this.state.brewId)).send(newLock).set('Content-Type', 'application/json').then(function (response) {
      _this.setState({
        result: response.body
      });
    })["catch"](function (err) {
      _this.setState({
        result: err.response.body
      });
    });
  },
  renderInput: function renderInput(name) {
    var _this2 = this;
    return /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: name,
      value: this.state[name],
      onChange: function onChange(e) {
        return _this2.handleChange(e, name);
      },
      autoComplete: "off",
      required: true
    });
  },
  renderResult: function renderResult() {
    var _this3 = this;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", null, "Result:"), /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("tbody", null, Object.keys(this.state.result).map(function (key, idx) {
      return /*#__PURE__*/React.createElement("tr", {
        key: "".concat(idx, "-row")
      }, /*#__PURE__*/React.createElement("td", {
        key: "".concat(idx, "-key")
      }, key), /*#__PURE__*/React.createElement("td", {
        key: "".concat(idx, "-value")
      }, _this3.state.result[key].toString()));
    }))));
  },
  render: function render() {
    var _this4 = this;
    return /*#__PURE__*/React.createElement("div", {
      className: "lockBrew"
    }, /*#__PURE__*/React.createElement("div", {
      className: "lockForm"
    }, /*#__PURE__*/React.createElement("h2", null, "Lock Brew"), /*#__PURE__*/React.createElement("form", {
      onSubmit: this.submit
    }, /*#__PURE__*/React.createElement("label", null, "ID:", this.renderInput('brewId')), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("label", null, "Error Code:", this.renderInput('code')), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("label", null, "Private Message:", this.renderInput('editMessage')), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("label", null, "Public Message:", this.renderInput('shareMessage')), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("label", {
      className: "checkbox"
    }, "Overwrite", /*#__PURE__*/React.createElement("input", {
      name: "overwrite",
      className: "checkbox",
      type: "checkbox",
      value: this.state.overwrite,
      onClick: function onClick() {
        return _this4.setState(function (prevState) {
          return {
            overwrite: !prevState.overwrite
          };
        });
      }
    })), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("input", {
      type: "submit"
    }))), this.state.result && this.renderResult()), /*#__PURE__*/React.createElement("div", {
      className: "lockSuggestions"
    }, /*#__PURE__*/React.createElement("h2", null, "Suggestions"), /*#__PURE__*/React.createElement("div", {
      className: "lockCodes"
    }, /*#__PURE__*/React.createElement("h3", null, "Codes"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "455 - Generic Lock"), /*#__PURE__*/React.createElement("li", null, "456 - Copyright issues"), /*#__PURE__*/React.createElement("li", null, "457 - Confidential Information Leakage"), /*#__PURE__*/React.createElement("li", null, "458 - Sensitive Personal Information"), /*#__PURE__*/React.createElement("li", null, "459 - Defamation or Libel"), /*#__PURE__*/React.createElement("li", null, "460 - Hate Speech or Discrimination"), /*#__PURE__*/React.createElement("li", null, "461 - Illegal Activities"), /*#__PURE__*/React.createElement("li", null, "462 - Malware or Phishing"), /*#__PURE__*/React.createElement("li", null, "463 - Plagiarism"), /*#__PURE__*/React.createElement("li", null, "465 - Misrepresentation"), /*#__PURE__*/React.createElement("li", null, "466 - Inappropriate Content"))), /*#__PURE__*/React.createElement("div", {
      className: "lockMessages"
    }, /*#__PURE__*/React.createElement("h3", null, "Messages"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Private Message:"), " This is the private message that is ONLY displayed to the authors of the locked brew. This message MUST specify exactly what actions must be taken in order to have the brew unlocked."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Public Message:"), " This is the public message that is displayed to the EVERYONE that attempts to view the locked brew.")))));
  }
});
var LockTable = createClass({
  displayName: 'LockTable',
  getDefaultProps: function getDefaultProps() {
    return {
      title: '',
      text: '',
      fetchURL: '/api/locks',
      resultName: '',
      propertyNames: ['shareId'],
      loadBrew: function loadBrew() {}
    };
  },
  getInitialState: function getInitialState() {
    return {
      result: '',
      error: '',
      searching: false
    };
  },
  lockKey: React.createRef(0),
  clickFn: function clickFn() {
    var _this5 = this;
    this.setState({
      searching: true,
      error: null
    });
    _requestMiddleware["default"].get(this.props.fetchURL).then(function (res) {
      return _this5.setState({
        result: res.body
      });
    })["catch"](function (err) {
      return _this5.setState({
        result: err.response.body
      });
    })["finally"](function () {
      _this5.setState({
        searching: false
      });
    });
  },
  updateBrewLockData: function updateBrewLockData(lockData) {
    this.lockKey.current++;
    var brewData = {
      key: this.lockKey.current,
      shareId: lockData.shareId,
      code: lockData.lock.code,
      editMessage: lockData.lock.editMessage,
      shareMessage: lockData.lock.shareMessage
    };
    this.props.loadBrew(brewData);
  },
  render: function render() {
    var _this6 = this;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "brewsAwaitingReview"
    }, /*#__PURE__*/React.createElement("div", {
      className: "brewBlock"
    }, /*#__PURE__*/React.createElement("h2", null, this.props.title), /*#__PURE__*/React.createElement("button", {
      onClick: this.clickFn
    }, "REFRESH", /*#__PURE__*/React.createElement("i", {
      className: "fas ".concat(!this.state.searching ? 'fa-search' : 'fa-spin fa-spinner')
    }))), this.state.result[this.props.resultName] && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, this.props.text, ": ", this.state.result[this.props.resultName].length), /*#__PURE__*/React.createElement("table", {
      className: "lockTable"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, this.props.propertyNames.map(function (name, idx) {
      return /*#__PURE__*/React.createElement("th", {
        key: idx
      }, name);
    }), /*#__PURE__*/React.createElement("th", null, "clip"), /*#__PURE__*/React.createElement("th", null, "load"))), /*#__PURE__*/React.createElement("tbody", null, this.state.result[this.props.resultName].map(function (result, resultIdx) {
      return /*#__PURE__*/React.createElement("tr", {
        className: "row",
        key: "".concat(resultIdx, "-row")
      }, _this6.props.propertyNames.map(function (name, nameIdx) {
        return /*#__PURE__*/React.createElement("td", {
          key: "".concat(resultIdx, "-").concat(nameIdx)
        }, result[name].toString());
      }), /*#__PURE__*/React.createElement("td", {
        className: "icon",
        title: "Copy ID to Clipboard",
        onClick: function onClick() {
          navigator.clipboard.writeText(result.shareId.toString());
        }
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-regular fa-clipboard"
      })), /*#__PURE__*/React.createElement("td", {
        className: "icon",
        title: "View Lock details",
        onClick: function onClick() {
          _this6.updateBrewLockData(result);
        }
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-regular fa-circle-down"
      })));
    }))))));
  }
});
var LockLookup = createClass({
  displayName: 'LockLookup',
  getDefaultProps: function getDefaultProps() {
    return {
      fetchURL: '/api/lookup'
    };
  },
  getInitialState: function getInitialState() {
    return {
      query: '',
      result: '',
      error: '',
      searching: false
    };
  },
  handleChange: function handleChange(e) {
    this.setState({
      query: e.target.value
    });
  },
  clickFn: function clickFn() {
    var _this7 = this;
    this.setState({
      searching: true,
      error: null
    });
    _requestMiddleware["default"].put("".concat(this.props.fetchURL, "/").concat(this.state.query)).then(function (res) {
      return _this7.setState({
        result: res.body
      });
    })["catch"](function (err) {
      return _this7.setState({
        result: err.response.body
      });
    })["finally"](function () {
      _this7.setState({
        searching: false
      });
    });
  },
  renderResult: function renderResult() {
    var _this8 = this;
    return /*#__PURE__*/React.createElement("div", {
      className: "lockLookup"
    }, /*#__PURE__*/React.createElement("h3", null, "Result:"), /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("tbody", null, Object.keys(this.state.result).map(function (key, idx) {
      return /*#__PURE__*/React.createElement("tr", {
        key: "".concat(idx, "-row")
      }, /*#__PURE__*/React.createElement("td", {
        key: "".concat(idx, "-key")
      }, key), /*#__PURE__*/React.createElement("td", {
        key: "".concat(idx, "-value")
      }, _this8.state.result[key].toString()));
    }))));
  },
  render: function render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "brewLookup"
    }, /*#__PURE__*/React.createElement("h2", null, this.props.title), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: this.state.query,
      onChange: this.handleChange,
      placeholder: "share id"
    }), /*#__PURE__*/React.createElement("button", {
      onClick: this.clickFn
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas ".concat(!this.state.searching ? 'fa-search' : 'fa-spin fa-spinner')
    })), this.state.error && /*#__PURE__*/React.createElement("div", {
      className: "error"
    }, this.state.error.toString()), this.state.result && this.renderResult());
  }
});
module.exports = LockTools;
},{"../../homebrew/utils/request-middleware.js":19,"./lockTools.less":13,"@babel/runtime/helpers/asyncToGenerator":23,"@babel/runtime/helpers/interopRequireDefault":24,"@babel/runtime/regenerator":38,"create-react-class":"create-react-class","react":"react"}],13:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],14:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
require('./notificationAdd.less');
var React = require('react');
var _require = require('react'),
  useState = _require.useState,
  useRef = _require.useRef;
var request = require('superagent');
var NotificationAdd = function NotificationAdd() {
  var _useState = useState(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    notificationResult = _useState2[0],
    setNotificationResult = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    searching = _useState4[0],
    setSearching = _useState4[1];
  var _useState5 = useState(null),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    error = _useState6[0],
    setError = _useState6[1];
  var dismissKeyRef = useRef(null);
  var titleRef = useRef(null);
  var textRef = useRef(null);
  var startAtRef = useRef(null);
  var stopAtRef = useRef(null);
  var saveNotification = /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var _startAt$toISOString, _stopAt$toISOString;
      var dismissKey, title, text, startAt, stopAt, data, response, _t;
      return _regenerator["default"].wrap(function (_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            dismissKey = dismissKeyRef.current.value;
            title = titleRef.current.value;
            text = textRef.current.value;
            startAt = new Date(startAtRef.current.value);
            stopAt = new Date(stopAtRef.current.value); // Basic validation
            if (!(!dismissKey || !title || !text || isNaN(startAt.getTime()) || isNaN(stopAt.getTime()))) {
              _context.next = 1;
              break;
            }
            setError('All fields are required');
            return _context.abrupt("return");
          case 1:
            if (!(startAt >= stopAt)) {
              _context.next = 2;
              break;
            }
            setError('End date must be after the start date!');
            return _context.abrupt("return");
          case 2:
            data = {
              dismissKey: dismissKey,
              title: title,
              text: text,
              startAt: (_startAt$toISOString = startAt === null || startAt === void 0 ? void 0 : startAt.toISOString()) !== null && _startAt$toISOString !== void 0 ? _startAt$toISOString : '',
              stopAt: (_stopAt$toISOString = stopAt === null || stopAt === void 0 ? void 0 : stopAt.toISOString()) !== null && _stopAt$toISOString !== void 0 ? _stopAt$toISOString : ''
            };
            _context.prev = 3;
            setSearching(true);
            setError(null);
            _context.next = 4;
            return request.post('/admin/notification/add').send(data);
          case 4:
            response = _context.sent;
            console.log(response.body);

            // Reset form fields
            dismissKeyRef.current.value = '';
            titleRef.current.value = '';
            textRef.current.value = '';
            setNotificationResult('Notification successfully created.');
            setSearching(false);
            _context.next = 6;
            break;
          case 5:
            _context.prev = 5;
            _t = _context["catch"](3);
            console.log(_t.response.body.message);
            setError("Error saving notification: ".concat(_t.response.body.message));
            setSearching(false);
          case 6:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[3, 5]]);
    }));
    return function saveNotification() {
      return _ref.apply(this, arguments);
    };
  }();
  return /*#__PURE__*/React.createElement("div", {
    className: "notificationAdd"
  }, /*#__PURE__*/React.createElement("h2", null, "Add Notification"), /*#__PURE__*/React.createElement("label", {
    className: "field"
  }, "Dismiss Key:", /*#__PURE__*/React.createElement("input", {
    className: "fieldInput",
    type: "text",
    ref: dismissKeyRef,
    required: true,
    placeholder: "dismiss_notif_drive"
  })), /*#__PURE__*/React.createElement("label", {
    className: "field"
  }, "Title:", /*#__PURE__*/React.createElement("input", {
    className: "fieldInput",
    type: "text",
    ref: titleRef,
    required: true,
    placeholder: "Stop using Google Drive as image host"
  })), /*#__PURE__*/React.createElement("label", {
    className: "field"
  }, "Text:", /*#__PURE__*/React.createElement("textarea", {
    className: "fieldInput",
    type: "text",
    ref: textRef,
    required: true,
    placeholder: "Google Drive is not an image hosting site, you should not use it as such."
  })), /*#__PURE__*/React.createElement("label", {
    className: "field"
  }, "Start Date:", /*#__PURE__*/React.createElement("input", {
    type: "date",
    className: "fieldInput",
    ref: startAtRef,
    required: true
  })), /*#__PURE__*/React.createElement("label", {
    className: "field"
  }, "End Date:", /*#__PURE__*/React.createElement("input", {
    type: "date",
    className: "fieldInput",
    ref: stopAtRef,
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "notificationResult"
  }, notificationResult), /*#__PURE__*/React.createElement("button", {
    className: "notificationSave",
    onClick: saveNotification,
    disabled: searching
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas ".concat(searching ? 'fa-spin fa-spinner' : 'fa-save')
  }), "Save Notification"), error && /*#__PURE__*/React.createElement("div", {
    className: "error"
  }, error));
};
module.exports = NotificationAdd;
},{"./notificationAdd.less":15,"@babel/runtime/helpers/asyncToGenerator":23,"@babel/runtime/helpers/interopRequireDefault":24,"@babel/runtime/helpers/slicedToArray":35,"@babel/runtime/regenerator":38,"react":"react","superagent":"superagent"}],15:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],16:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
require('./notificationLookup.less');
var React = require('react');
var _require = require('react'),
  useState = _require.useState;
var request = require('superagent');
var Moment = require('moment');
var NotificationDetail = function NotificationDetail(_ref) {
  var notification = _ref.notification,
    onDelete = _ref.onDelete;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("dl", null, /*#__PURE__*/React.createElement("dt", null, "Key"), /*#__PURE__*/React.createElement("dd", null, notification.dismissKey), /*#__PURE__*/React.createElement("dt", null, "Title"), /*#__PURE__*/React.createElement("dd", null, notification.title || 'No Title'), /*#__PURE__*/React.createElement("dt", null, "Created"), /*#__PURE__*/React.createElement("dd", null, Moment(notification.createdAt).format('LLLL')), /*#__PURE__*/React.createElement("dt", null, "Start"), /*#__PURE__*/React.createElement("dd", null, Moment(notification.startAt).format('LLLL') || 'No Start Time'), /*#__PURE__*/React.createElement("dt", null, "Stop"), /*#__PURE__*/React.createElement("dd", null, Moment(notification.stopAt).format('LLLL') || 'No End Time'), /*#__PURE__*/React.createElement("dt", null, "Text"), /*#__PURE__*/React.createElement("dd", null, notification.text || 'No Text')), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return onDelete(notification.dismissKey);
    }
  }, "DELETE"));
};
var NotificationLookup = function NotificationLookup() {
  var _useState = useState(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    searching = _useState2[0],
    setSearching = _useState2[1];
  var _useState3 = useState(null),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    error = _useState4[0],
    setError = _useState4[1];
  var _useState5 = useState([]),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    notifications = _useState6[0],
    setNotifications = _useState6[1];
  var lookupAll = /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var res, _t;
      return _regenerator["default"].wrap(function (_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            setSearching(true);
            setError(null);
            _context.prev = 1;
            _context.next = 2;
            return request.get('/admin/notification/all');
          case 2:
            res = _context.sent;
            setNotifications(res.body || []);
            _context.next = 4;
            break;
          case 3:
            _context.prev = 3;
            _t = _context["catch"](1);
            console.log(_t);
            setError("Error looking up notifications: ".concat(_t.response.body.message));
          case 4:
            _context.prev = 4;
            setSearching(false);
            return _context.finish(4);
          case 5:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[1, 3, 4, 5]]);
    }));
    return function lookupAll() {
      return _ref2.apply(this, arguments);
    };
  }();
  var deleteNotification = /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(dismissKey) {
      var confirmed, _t2;
      return _regenerator["default"].wrap(function (_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            if (dismissKey) {
              _context2.next = 1;
              break;
            }
            return _context2.abrupt("return");
          case 1:
            confirmed = window.confirm("Really delete notification ".concat(dismissKey, "?"));
            if (confirmed) {
              _context2.next = 2;
              break;
            }
            console.log('Delete notification cancelled');
            return _context2.abrupt("return");
          case 2:
            console.log('Delete notification confirm');
            _context2.prev = 3;
            _context2.next = 4;
            return request["delete"]("/admin/notification/delete/".concat(dismissKey));
          case 4:
            lookupAll();
            _context2.next = 6;
            break;
          case 5:
            _context2.prev = 5;
            _t2 = _context2["catch"](3);
            console.log(_t2);
            setError("Error deleting notification: ".concat(_t2.response.body.message));
          case 6:
            ;
          case 7:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[3, 5]]);
    }));
    return function deleteNotification(_x) {
      return _ref3.apply(this, arguments);
    };
  }();
  var renderNotificationsList = function renderNotificationsList() {
    if (error) return /*#__PURE__*/React.createElement("div", {
      className: "error"
    }, error);
    if (notifications.length === 0) return /*#__PURE__*/React.createElement("div", {
      className: "noNotification"
    }, "No notifications available.");
    return /*#__PURE__*/React.createElement("ul", {
      className: "notificationList"
    }, notifications.map(function (notification) {
      return /*#__PURE__*/React.createElement("li", {
        key: notification.dismissKey
      }, /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null, notification.title || 'No Title'), /*#__PURE__*/React.createElement(NotificationDetail, {
        notification: notification,
        onDelete: deleteNotification
      })));
    }));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "notificationLookup"
  }, /*#__PURE__*/React.createElement("h2", null, "Check all Notifications"), /*#__PURE__*/React.createElement("button", {
    onClick: lookupAll
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas ".concat(searching ? 'fa-spin fa-spinner' : 'fa-search')
  })), renderNotificationsList());
};
module.exports = NotificationLookup;
},{"./notificationLookup.less":17,"@babel/runtime/helpers/asyncToGenerator":23,"@babel/runtime/helpers/interopRequireDefault":24,"@babel/runtime/helpers/slicedToArray":35,"@babel/runtime/regenerator":38,"moment":"moment","react":"react","superagent":"superagent"}],17:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],18:[function(require,module,exports){
"use strict";

var React = require('react');
var NotificationLookup = require('./notificationLookup/notificationLookup.jsx');
var NotificationAdd = require('./notificationAdd/notificationAdd.jsx');
var NotificationUtils = function NotificationUtils() {
  return /*#__PURE__*/React.createElement("section", {
    className: "notificationUtils"
  }, /*#__PURE__*/React.createElement(NotificationAdd, null), /*#__PURE__*/React.createElement(NotificationLookup, null));
};
module.exports = NotificationUtils;
},{"./notificationAdd/notificationAdd.jsx":14,"./notificationLookup/notificationLookup.jsx":16,"react":"react"}],19:[function(require,module,exports){
(function (global){(function (){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _superagent = _interopRequireDefault(require("superagent"));
var addHeader = function addHeader(request) {
  return request.set('Homebrewery-Version', global.version);
};
var requestMiddleware = {
  get: function get(path) {
    return addHeader(_superagent["default"].get(path));
  },
  put: function put(path) {
    return addHeader(_superagent["default"].put(path));
  },
  post: function post(path) {
    return addHeader(_superagent["default"].post(path));
  },
  "delete": function _delete(path) {
    return addHeader(_superagent["default"]["delete"](path));
  }
};
var _default = exports["default"] = requestMiddleware;
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"@babel/runtime/helpers/interopRequireDefault":24,"superagent":"superagent"}],20:[function(require,module,exports){
"use strict";

function _OverloadYield(e, d) {
  this.v = e, this.k = d;
}
module.exports = _OverloadYield, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],21:[function(require,module,exports){
"use strict";

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],22:[function(require,module,exports){
"use strict";

function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],23:[function(require,module,exports){
"use strict";

function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c),
      u = i.value;
  } catch (n) {
    return void e(n);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
  return function () {
    var t = this,
      e = arguments;
    return new Promise(function (r, o) {
      var a = n.apply(t, e);
      function _next(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
      }
      function _throw(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
      }
      _next(void 0);
    });
  };
}
module.exports = _asyncToGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],24:[function(require,module,exports){
"use strict";

function _interopRequireDefault(e) {
  return e && e.__esModule ? e : {
    "default": e
  };
}
module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],25:[function(require,module,exports){
"use strict";

function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],26:[function(require,module,exports){
"use strict";

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableRest, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],27:[function(require,module,exports){
"use strict";

var regeneratorDefine = require("./regeneratorDefine.js");
function _regenerator() {
  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */
  var e,
    t,
    r = "function" == typeof Symbol ? Symbol : {},
    n = r.iterator || "@@iterator",
    o = r.toStringTag || "@@toStringTag";
  function i(r, n, o, i) {
    var c = n && n.prototype instanceof Generator ? n : Generator,
      u = Object.create(c.prototype);
    return regeneratorDefine(u, "_invoke", function (r, n, o) {
      var i,
        c,
        u,
        f = 0,
        p = o || [],
        y = !1,
        G = {
          p: 0,
          n: 0,
          v: e,
          a: d,
          f: d.bind(e, 4),
          d: function d(t, r) {
            return i = t, c = 0, u = e, G.n = r, a;
          }
        };
      function d(r, n) {
        for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) {
          var o,
            i = p[t],
            d = G.p,
            l = i[2];
          r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0));
        }
        if (o || r > 1) return a;
        throw y = !0, n;
      }
      return function (o, p, l) {
        if (f > 1) throw TypeError("Generator is already running");
        for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) {
          i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u);
          try {
            if (f = 2, i) {
              if (c || (o = "next"), t = i[o]) {
                if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object");
                if (!t.done) return t;
                u = t.value, c < 2 && (c = 0);
              } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1);
              i = e;
            } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break;
          } catch (t) {
            i = e, c = 1, u = t;
          } finally {
            f = 1;
          }
        }
        return {
          value: t,
          done: y
        };
      };
    }(r, o, i), !0), u;
  }
  var a = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  t = Object.getPrototypeOf;
  var c = [][n] ? t(t([][n]())) : (regeneratorDefine(t = {}, n, function () {
      return this;
    }), t),
    u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c);
  function f(e) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, regeneratorDefine(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e;
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, regeneratorDefine(u, "constructor", GeneratorFunctionPrototype), regeneratorDefine(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", regeneratorDefine(GeneratorFunctionPrototype, o, "GeneratorFunction"), regeneratorDefine(u), regeneratorDefine(u, o, "Generator"), regeneratorDefine(u, n, function () {
    return this;
  }), regeneratorDefine(u, "toString", function () {
    return "[object Generator]";
  }), (module.exports = _regenerator = function _regenerator() {
    return {
      w: i,
      m: f
    };
  }, module.exports.__esModule = true, module.exports["default"] = module.exports)();
}
module.exports = _regenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./regeneratorDefine.js":31}],28:[function(require,module,exports){
"use strict";

var regeneratorAsyncGen = require("./regeneratorAsyncGen.js");
function _regeneratorAsync(n, e, r, t, o) {
  var a = regeneratorAsyncGen(n, e, r, t, o);
  return a.next().then(function (n) {
    return n.done ? n.value : a.next();
  });
}
module.exports = _regeneratorAsync, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./regeneratorAsyncGen.js":29}],29:[function(require,module,exports){
"use strict";

var regenerator = require("./regenerator.js");
var regeneratorAsyncIterator = require("./regeneratorAsyncIterator.js");
function _regeneratorAsyncGen(r, e, t, o, n) {
  return new regeneratorAsyncIterator(regenerator().w(r, e, t, o), n || Promise);
}
module.exports = _regeneratorAsyncGen, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./regenerator.js":27,"./regeneratorAsyncIterator.js":30}],30:[function(require,module,exports){
"use strict";

var OverloadYield = require("./OverloadYield.js");
var regeneratorDefine = require("./regeneratorDefine.js");
function AsyncIterator(t, e) {
  function n(r, o, i, f) {
    try {
      var c = t[r](o),
        u = c.value;
      return u instanceof OverloadYield ? e.resolve(u.v).then(function (t) {
        n("next", t, i, f);
      }, function (t) {
        n("throw", t, i, f);
      }) : e.resolve(u).then(function (t) {
        c.value = t, i(c);
      }, function (t) {
        return n("throw", t, i, f);
      });
    } catch (t) {
      f(t);
    }
  }
  var r;
  this.next || (regeneratorDefine(AsyncIterator.prototype), regeneratorDefine(AsyncIterator.prototype, "function" == typeof Symbol && Symbol.asyncIterator || "@asyncIterator", function () {
    return this;
  })), regeneratorDefine(this, "_invoke", function (t, o, i) {
    function f() {
      return new e(function (e, r) {
        n(t, i, e, r);
      });
    }
    return r = r ? r.then(f, f) : f();
  }, !0);
}
module.exports = AsyncIterator, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./OverloadYield.js":20,"./regeneratorDefine.js":31}],31:[function(require,module,exports){
"use strict";

function _regeneratorDefine(e, r, n, t) {
  var i = Object.defineProperty;
  try {
    i({}, "", {});
  } catch (e) {
    i = 0;
  }
  module.exports = _regeneratorDefine = function regeneratorDefine(e, r, n, t) {
    if (r) i ? i(e, r, {
      value: n,
      enumerable: !t,
      configurable: !t,
      writable: !t
    }) : e[r] = n;else {
      var o = function o(r, n) {
        _regeneratorDefine(e, r, function (e) {
          return this._invoke(r, n, e);
        });
      };
      o("next", 0), o("throw", 1), o("return", 2);
    }
  }, module.exports.__esModule = true, module.exports["default"] = module.exports, _regeneratorDefine(e, r, n, t);
}
module.exports = _regeneratorDefine, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],32:[function(require,module,exports){
"use strict";

function _regeneratorKeys(e) {
  var n = Object(e),
    r = [];
  for (var t in n) r.unshift(t);
  return function e() {
    for (; r.length;) if ((t = r.pop()) in n) return e.value = t, e.done = !1, e;
    return e.done = !0, e;
  };
}
module.exports = _regeneratorKeys, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],33:[function(require,module,exports){
"use strict";

var OverloadYield = require("./OverloadYield.js");
var regenerator = require("./regenerator.js");
var regeneratorAsync = require("./regeneratorAsync.js");
var regeneratorAsyncGen = require("./regeneratorAsyncGen.js");
var regeneratorAsyncIterator = require("./regeneratorAsyncIterator.js");
var regeneratorKeys = require("./regeneratorKeys.js");
var regeneratorValues = require("./regeneratorValues.js");
function _regeneratorRuntime() {
  "use strict";

  var r = regenerator(),
    e = r.m(_regeneratorRuntime),
    t = (Object.getPrototypeOf ? Object.getPrototypeOf(e) : e.__proto__).constructor;
  function n(r) {
    var e = "function" == typeof r && r.constructor;
    return !!e && (e === t || "GeneratorFunction" === (e.displayName || e.name));
  }
  var o = {
    "throw": 1,
    "return": 2,
    "break": 3,
    "continue": 3
  };
  function a(r) {
    var e, t;
    return function (n) {
      e || (e = {
        stop: function stop() {
          return t(n.a, 2);
        },
        "catch": function _catch() {
          return n.v;
        },
        abrupt: function abrupt(r, e) {
          return t(n.a, o[r], e);
        },
        delegateYield: function delegateYield(r, o, a) {
          return e.resultName = o, t(n.d, regeneratorValues(r), a);
        },
        finish: function finish(r) {
          return t(n.f, r);
        }
      }, t = function t(r, _t, o) {
        n.p = e.prev, n.n = e.next;
        try {
          return r(_t, o);
        } finally {
          e.next = n.n;
        }
      }), e.resultName && (e[e.resultName] = n.v, e.resultName = void 0), e.sent = n.v, e.next = n.n;
      try {
        return r.call(this, e);
      } finally {
        n.p = e.prev, n.n = e.next;
      }
    };
  }
  return (module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
    return {
      wrap: function wrap(e, t, n, o) {
        return r.w(a(e), t, n, o && o.reverse());
      },
      isGeneratorFunction: n,
      mark: r.m,
      awrap: function awrap(r, e) {
        return new OverloadYield(r, e);
      },
      AsyncIterator: regeneratorAsyncIterator,
      async: function async(r, e, t, o, u) {
        return (n(e) ? regeneratorAsyncGen : regeneratorAsync)(a(r), e, t, o, u);
      },
      keys: regeneratorKeys,
      values: regeneratorValues
    };
  }, module.exports.__esModule = true, module.exports["default"] = module.exports)();
}
module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./OverloadYield.js":20,"./regenerator.js":27,"./regeneratorAsync.js":28,"./regeneratorAsyncGen.js":29,"./regeneratorAsyncIterator.js":30,"./regeneratorKeys.js":32,"./regeneratorValues.js":34}],34:[function(require,module,exports){
"use strict";

var _typeof = require("./typeof.js")["default"];
function _regeneratorValues(e) {
  if (null != e) {
    var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"],
      r = 0;
    if (t) return t.call(e);
    if ("function" == typeof e.next) return e;
    if (!isNaN(e.length)) return {
      next: function next() {
        return e && r >= e.length && (e = void 0), {
          value: e && e[r++],
          done: !e
        };
      }
    };
  }
  throw new TypeError(_typeof(e) + " is not iterable");
}
module.exports = _regeneratorValues, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./typeof.js":36}],35:[function(require,module,exports){
"use strict";

var arrayWithHoles = require("./arrayWithHoles.js");
var iterableToArrayLimit = require("./iterableToArrayLimit.js");
var unsupportedIterableToArray = require("./unsupportedIterableToArray.js");
var nonIterableRest = require("./nonIterableRest.js");
function _slicedToArray(r, e) {
  return arrayWithHoles(r) || iterableToArrayLimit(r, e) || unsupportedIterableToArray(r, e) || nonIterableRest();
}
module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./arrayWithHoles.js":22,"./iterableToArrayLimit.js":25,"./nonIterableRest.js":26,"./unsupportedIterableToArray.js":37}],36:[function(require,module,exports){
"use strict";

function _typeof(o) {
  "@babel/helpers - typeof";

  return module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof(o);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],37:[function(require,module,exports){
"use strict";

var arrayLikeToArray = require("./arrayLikeToArray.js");
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? arrayLikeToArray(r, a) : void 0;
  }
}
module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./arrayLikeToArray.js":21}],38:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
// TODO(Babel 8): Remove this file.

var runtime = require("../helpers/regeneratorRuntime")();
module.exports = runtime;

// Copied from https://github.com/facebook/regenerator/blob/main/packages/runtime/runtime.js#L736=
try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  if ((typeof globalThis === "undefined" ? "undefined" : (0, _typeof2["default"])(globalThis)) === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}
},{"../helpers/regeneratorRuntime":33,"@babel/runtime/helpers/interopRequireDefault":24,"@babel/runtime/helpers/typeof":36}]},{},[1])(1)
});
;const comp=module.exports;;module.exports=(props)=>require('react-dom/server').renderToString(require('react').createElement(comp, props))