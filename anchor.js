/*
npm install dom-anchor-text-quote
npm install dom-seek
npm install jquery
npm install xpath-range
browserify anchor.js -o anchor-bundle.js
*/


/*
<script src="./anchor-bundle.js"></script>
<script>
get_annotations();
</script>
*/


function attach_annotation(tag, text, exact, prefix) {
	var TextQuoteAnchor = require ('dom-anchor-text-quote')
	var XPathRange = require('xpath-range')			       
	var $ = require('jQuery');
	var root = $('body')[0];
	var tqa = new TextQuoteAnchor(root, exact, {'prefix':prefix});
	var range = tqa.toRange();
	nodes = XPathRange.Range.sniff(range).normalize().textNodes()
	$(nodes).wrap('<span style="background-color:' + tag + '" title="' + text + '"></span>')
}

function get_annotations() {
	var $ = require('jQuery');
	url = 'https://hypothes.is/api/search?uri=' + location.href;
	$.ajax({
		url: url,
		success: attach_annotations
	});
}

function attach_annotations(data) {
	var rows = data['rows']
	for ( var i=0; i < rows.length; i++ ) {
		var row = rows[i];
		if ( ! row.hasOwnProperty('target') )
			continue;
		var selectors = row['target'][0]['selector'];
		var selector = null;
		for (var j=0; j<selectors.length; j++) {
			if ( selectors[j].hasOwnProperty('exact') ) 
				selector = selectors[j];
		}
		if ( selector == null )
			continue;
		var exact = selector['exact'];
		var prefix = selector['prefix'];
		var text = row['text'];
		var tags = row['tags'];
		if ( tags.length ) {
            tag = tags[0];			
		}
		attach_annotation(tag, text, exact, prefix);
	}
}

window.get_annotations = get_annotations

