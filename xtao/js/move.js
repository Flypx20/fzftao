;(function($){
	function init($elem){
			this.$elem = $elem;
			this.currentX = parseFloat(this.$elem.css('left'));
			this.currentY = parseFloat(this.$elem.css('top'));			
		}

		function to(x,y,callBack){
			x = (typeof x == 'number') ? x : this.currentX; 
			y = (typeof y == 'number') ? y : this.currentY; 

			if(this.currentX == x && this.currentY == y) return;

			this.$elem.trigger('move');

			if(typeof callBack == 'function') callBack();

			this.currentX = x;
			this.currentY = y;			
		}

		function Slient($elem){
			init.call(this,$elem);
			this.$elem.removeClass('transition');
		}

		Slient.prototype = {
			constructor : Slient,
			to:function(x,y){
				var self = this;
				to.call(this,x,y,function(){
					self.$elem.css({
						top:y,
						left:x,
					});
					self.$elem.trigger('moved');
				});
			},
			x:function(x){
				this.to(x);
			},
			y:function(y){
				this.to(null,y);
			}
		};

		function Css3($elem){
			init.call(this,$elem);
			this.$elem.addClass('transition');
			//初始化添加left和top
			this.$elem.css({
				left:this.currentX,
				top:this.currentY
			});
		}

		Css3.prototype = {
			constructor : Css3,
			to:function(x,y){
				var self = this;
				to.call(this,x,y,function(){
					//监听过渡完成事件
					self.$elem
					.off(kuazhu.transition.end)
					.one(kuazhu.transition.end,function(){
						self.$elem.trigger('moved');
					});
					self.$elem.css({
						top:y,
						left:x,
					});
				});				
			},
			x:function(x){
				this.to(x);
			},
			y:function(y){
				this.to(null,y);
			}
		};
		function Js($elem){
			init.call(this,$elem);
			this.$elem.removeClass('transition');
		}

		Js.prototype = {
			constructor : Js,
			to:function(x,y){
				var self = this;
				to.call(this,x,y,function(){
					self.$elem
					.stop()
					.animate({
						left:x,
						top:y
					},function(){
						self.$elem.trigger('moved');
					});
				});				
			},
			x:function(x){
				this.to(x);
			},
			y:function(y){
				this.to(null,y);
			}
		};

		var Default = {
			css3:true,
			js:true
		};

		var mode = null;

		function move($elem,options){
			if(options.css3 && kuazhu.transition.isSupport){//css3的移动
				mode = Css3;
			}
			else if(options.js){
				mode = Js;
			}
			else{
				mode = Slient;
			}

			return {
				to:$.proxy(mode.to,mode),
				x:$.proxy(mode.x,mode),
				y:$.proxy(mode.y,mode)
			};

		}



		var move = new Js($('.box'));
		
		$('.box').on('move moved',function(ev){
			console.log(ev.type);
		});
		//move to left
		$('button').eq(0).on('click',function(){
			move.to(0,100);
			// move.x(0);
			// move.to(0);
			// move.y(50);

		});
		//move to right
		$('button').eq(1).on('click',function(){
			move.to(200,200);
			// move.x(100);
			// move.y(200);

		});
})(jQuery);