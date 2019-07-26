$(function(){
    $('.like-coll').click(function(){
        var bid = $('#bid').val()
        var uid =  $('#uid').val()
        var url = ''
        if ( !uid ) {
            Swal.fire('Tips', 'Please login first !', 'info')
        }
        if (this.id == 'like') {
            url = '/api/like?blog=' + bid + '&operator=' + uid
        } else {
            url = '/api/collect?blog=' + bid + '&operator=' + uid
        }
        $.get(url, function(data){
            if (data['code'] == 0) {
                Swal.fire({
                    type: 'success',
                    title: 'success',
                    timer: 800
                })
            } else {
                Swal.fire('Tips', data['msg'], 'info')
            }
        })
    })
})