$(function(){
    // 页面加载完，获取评论数据并渲染
    getComments () 

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

    // 点击加载更多，获取评论渲染
    $('#more').click(function () {
        getComments()
    });

    function getComments () {
        var currentCount = $('.comment').length
        var bid = $('#bid').val()
        $.get('/api/comment?cc=' + currentCount + '&bid=' + bid, function (data) {
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
    }


    $('#messageBtn').click(function(e){
        var bid = $('input[name="bid"]').val()
        var content = $('#messageContent').val()
        var author = $('#author').text()
        var datetime = timeFormat(new Date())
        e.preventDefault()
        
        // 如果评论内容为空，给出提示并直接返回
        if (! (bid && content)) {
            $('#messageContent').attr('placeholder', '请输入评论内容')
            return
        }
        $.post('/comment', { bid, content }, function(data){
            if (data['code'] == 0) {
                var commentCount = parseInt($('.commentCount').eq(0).text())
                commentCount++;
                $('.commentCount').text(commentCount.toString())

                $('#messageContent').val('')
                
                $('.items').prepend(`
                <div class="panel panel-danger comment">
                    <div class="panel-body">` + author + `评论于` + datetime + ` </div>
                    <div class="panel-footer">` + content + `</div>
                </div>`)
            }
        })
    })
})