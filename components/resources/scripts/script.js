$(function(){

	var navOffset = $("nav").height();

	updateFullScreen();
	addSticky();

	//----Functions----//

	function updateFullScreen() {
		$('.fullscreen').css('height', $(window).height());		
		if ($(window).width() <=960){
			if($("#contact").hasClass("fullscreen")){
				$("#contact").addClass("fullscreen");
				$("#contact").css('height', 'auto');
			}
		}else{
			$("#contact").addClass("fullscreen");
		}
		if ($(window).width() <= 650){
			$(".mainArrow a").attr("href", "#aboutUs");
			$("#aboutUs").removeClass("fullscreen");
			$("#aboutUs").css('height', 'auto');
			$("footer i").removeClass("fa-2x");
		} else{
			$(".mainArrow a").attr("href","#welcome");
			$("#aboutUs").addClass("fullscreen");
			$("footer i").addClass("fa-2x");
		}
	}

	$('a[href*=\\#]:not([href=\\#])').click(function(){
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				$('html,body').animate({
					scrollTop: target.offset().top - (navOffset - 1)
				}, 1000);
				return false;
			}
		}
	});

	$(window).resize(function(){
		updateFullScreen();		
		navOffset = $("nav").height();
		ScrollMagicModule.updateSceneOffset(navOffset);
		addSticky();
	});

	$(window).scroll(function(){
		addSticky();
		var windowpos = $(window).scrollTop() + navOffset;
		$('nav li a').removeClass('active');
		$("nav li a").each(function() {
			var navItem = $(this).attr("href");
			if (windowpos > $(navItem).offset().top) {
				$('nav li a').removeClass('active');
				$('a[href$="' + navItem + '"]').addClass('active');
			}
		});
	});

	function addSticky() {
		var paddingEl = $("#welcome").is(":visible") ? "#welcome" : "#aboutUs";
		var navPadding = $("nav").height() + parseInt($(paddingEl).css("padding-top"));
		if (window.pageYOffset >= $(window).height()) {
			if (!($("nav").hasClass("stickyNav"))) {
				$("nav").addClass("stickyNav");
				$(paddingEl).css("padding-top", navPadding);
			}
		}
		else {
			$("nav").removeClass("stickyNav");
			$(paddingEl).css("padding-top",
				navPadding - parseInt($(paddingEl).css("padding-top"))
			);
		}
	}

	var ScrollMagicModule = (function(){
		var controller = new ScrollMagic.Controller(),
			contactoTween = TweenMax.staggerFromTo(
				'#contact article',
				1,
				{ opacity: 0, scale: 0 },
				{ delay: 0, opacity: 1, scale: 1, ease: Back.easeOut }
			),
			sceneContact = new ScrollMagic.Scene({
				triggerElement: '#contact',
				offset: navOffset,
				triggerHook: 'onCenter'
			}).setTween(contactoTween).addTo(controller),
			mobileTouch = 'ontouchstart' in document.documentElement;

		if (!mobileTouch) {
			var serviceOrigin = {
				bottom: -700,
				opacity: 0,
				scale: 0
			},
				serviceDest = {
					repeat: 1,
					yoyo: true,
					bottom: 0,
					opacity: 1,
					scale: 1,
					ease: Back.easeOut
				},
				serviceSceneArray = [];

			Array.from($("#services article")).forEach(function (service) {

				var serviceTween = TweenMax.staggerFromTo(
					"#" + service.id + " .content",
					1, serviceOrigin, serviceDest
				);

				var pin = new ScrollMagic.Scene({
					triggerElement: '#' + service.id,
					offset: -navOffset,
					duration: $(window).height(),
					triggerHook: 'onLeave'
				}).setPin('#' + service.id)
					.setTween(serviceTween)
					.addTo(controller);

				serviceSceneArray.push(pin);
			});
		}

		var updateOffset = function (newOffset) {
			sceneContact.offset(newOffset);
			sceneContact.refresh();
			if (serviceSceneArray) {
				serviceSceneArray.forEach(function (scene) {
					scene.offset(-newOffset);
					scene.duration($(window).height());
					scene.refresh();
				});
			}
		}
		return {
			updateSceneOffset: updateOffset
		}
	})();
});