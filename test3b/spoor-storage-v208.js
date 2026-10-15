/* Static Pages test: writes stay in the isolated browser test store. */
window.SpoorStorage={async save(snapshot){return JSON.parse(JSON.stringify(snapshot));}};
