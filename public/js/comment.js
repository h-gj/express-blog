$(function(){
    var timeFormat = function (date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        var currentTime = '';
        if (month > 9) {
            currentTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        }
        else {
            currentTime = year + '-' + '0' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        }
        return currentTime
    }

    $('#more').click(function () {
        var currentCount = $('.comment').length
        var bid = $('#bid').val()
        $.get('/comment?cc=' + currentCount + '&bid=' + bid, function (data) {
            if (data['code'] == 0) {
                var data = data['data']
                if (!data.length) {
                    $('#more').text('到底啦（^_^）~~')
                    $('#more').css('cursor', 'not-allowed')
                    return
                }
                data.forEach(element => {
                    var dtString = timeFormat(new Date(element.add_time))
                    $('.items').append(`
                        <div class="panel panel-danger comment">
                            <div class="panel-body">` + element.author.username + `评论于` + dtString + ` </div>
                            <div class="panel-footer">` + element.content + `</div>
                        </div>`)
                });
            }
        })

    });


    $('#messageBtn').click(function(e){
        var bid = $('input[name="bid"]').val()
        var content = $('#messageContent').val()
        var author = $('#author').text()
        var datetime = timeFormat(new Date())
        e.preventDefault()
        $.post('/comment', { bid, content }, function(data){
            if (data['code'] == 0) {
                $('.items').prepend(`
                <div class="panel panel-danger comment">
                    <div class="panel-body">` + author + `评论于` + datetime + ` </div>
                    <div class="panel-footer">` + content + `</div>
                </div>`)
            }
        })
    })
})