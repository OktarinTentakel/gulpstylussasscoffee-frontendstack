(->
   $ ->
      fClickAction = -> console.log('start-coffee')
      fClickCallback = _.debounce(fClickAction, 1000, {leading: true})

      $('.button.success')
         .first()
            .on('click', fClickCallback)
         .end()
)()
