(function(){

    $(function(){

        var fClickCallback = _.debounce(function(){ console.log('start'); }, 1000, {leading : true});

        $('.button.success').first().on('click', function(){
            fClickCallback();
        });

    });

})();
