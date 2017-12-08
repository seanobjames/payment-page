var AcceptedCards = (function() {
	
	const cardLogoUrls = [{
		id: "VISA",
		src: "https://quickstream.westpac.com.au/en/onlinepayment/images/logo_visacard_hires.png",
		height: 26,
		width: 53
	},{
		id: "MASTERCARD",
		src: "https://quickstream.westpac.com.au/en/onlinepayment/images/logo_mastercard_hires.png",
		height: 28,
		width: 47
	},{
		id: "AMEX",
		src: "https://quickstream.westpac.com.au/en/onlinepayment/images/logo_amex_hires.png",
		height: 28,
		width: 28
	},{
		id: "DINERS",
		src: "https://quickstream.westpac.com.au/en/onlinepayment/images/logo_diners_hires.png",
		height: 28,
		width: 34
	},{
		id: "UNIONPAY",
		src: "https://quickstream.westpac.com.au/en/onlinepayment/images/logo_unionpay_hires.png",
		height: 28,
		width: 43
	}];
	
	function appendCardLogo( cardLogoContainer, cardScheme ){
		
		let result = $.grep( cardLogoUrls, function( l ){ 
			return l.id == cardScheme; 
		} );
		
		if(result[0]) {
			let logo = result[0];
			cardLogoContainer.append( $("<img>")
				.attr("id", "cardLogo" + logo.id)
				.attr("src", logo.src)
				.attr("alt", logo.id + " Logo")
				.attr("title", logo.id + " Logo")
				.attr("height", logo.height)
				.attr("width", logo.width) );
		}
		
	}
	
	var myCardsModule,
	mySupplierBusinessCode,
	myForm;
	var init = function( options ){
		
		myCardsModule = options.cardsModule;
		mySupplierBusinessCode = options.supplierBusinessCode;
		myForm = options.form;
		
		var cardNumberField = myForm.find("[data-quickstream-api='cardNumber']");
		cardNumberField[0].addEventListener('keyup', function( event ){
			
			myCardsModule.getCardScheme( myForm[0], function( errors, data ) {
				
				// handle backspace or delete
				$("img[id^='cardLogo'").removeClass("disabled");
				$("img[id^='cardLogo'").removeClass("animated wobble");
				
				// show card
				if( !errors ) {
					$("img[id^='cardLogo'").addClass("disabled");
					$("#cardLogo" + data).removeClass("disabled");
					$("#cardLogo" + data).addClass("animated wobble");
				} 
			} );
		} );
	}
	
	var appendAcceptedCards = function( cardLogoContainer ){
		if(!myCardsModule) {
			console.log("You must call init()");
		}
		myCardsModule.getAcceptedCards( mySupplierBusinessCode, function( errors, data ) {
			if( !errors ) {
				data.forEach( function( acceptedCard ) {
					appendCardLogo( cardLogoContainer, acceptedCard.cardScheme );
				} );
			}
		} );
	}
		
	var appendCardSurcharges = function( cardSurchargesContainer ){
		$.ajax({
			type: 'GET',
			url: 'https://api.quickstream.westpac.com.au/rest/v1/businesses/QUICKSTREAMDEMO/card-surcharges',
			headers: {
				"Authorization":"Basic UVVJQ0tTVFJFQU1ERU1PX1BVQg==",
				"Accept":"application/json"
			},
			success: function( results ) {
				if(results.data) {
					var list = $("<ul>");
					list.appendTo( cardSurchargesContainer );
					results.data.forEach( function( cardSurcharge ) {
						if( cardSurcharge.surchargePercentage > 0 ) {
							surchargeTexts.push( cardSurcharge.cardScheme + " " + toSentenceCase(cardSurcharge.cardType) + " " + cardSurcharge.surchargePercentage );
							list.append( $("<li>") );
						}
					} );
					return surchargeTexts;
				}
			}
		});
	}
	
	function toSentenceCase(str) {
		return str.replace(/\w\S*/g, function( txt ) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}
	
	return {
		init: init,
		appendCardSurcharges: appendCardSurcharges,
		appendAcceptedCards: appendAcceptedCards
	}
	
})();