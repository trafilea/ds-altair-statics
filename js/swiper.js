var Webflow = Webflow || [];
Webflow.push(function () {
    // pollRequestStatus will poll the status of the request every 5 seconds, if the response is a failure it'll try again. otherwise it'll break
    function pollRequestStatus(request_id) {
        // poll the status of the request every 5 seconds, the endpoint is BASE_ENDPOINT/get_results
        // if the response is a failure it'll try again. otherwise it'll break
        // only do the request every 5 seconds
        intervalId = setInterval(function () {

            $.ajax({
                // method: "GET",
                // url: BASE_ENDPOINT_SANDBOX + "/get_results?request_id=" + request_id
                method: "POST",
                url: BASE_ENDPOINT_SANDBOX + "/get_results",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({"request_id": request_id}),
            })
                .done((res) => {
                    console.log(res);
                    res = res["text"]
                    clearInterval(intervalId);
                    
                    hideOverlay();
                    
                    // json_data = JSON.parse(res);
                    // swiped_benchmark_str = json_data['choices'][0]['message']['content'];
                    swiped_benchmark_str = res;
                    document.getElementById("txtBenchmarkSwiped").value = swiped_benchmark_str;

                })
                .fail((res) => {
                    console.log(res);
                })
        }, 5000);
    }

    $("#btnSwipe").click(function (){
        // ad type text loaded
        ad_type = document.getElementById("txtAdType").value;
    
        // product summary loaded
        product_summary = document.getElementById("txtProductSummary").value;
        
        // benchmark text loaded
        benchmark_text = document.getElementById("txtBenchmarkText").value;

        my_data = {
            "ad_type": ad_type,
            "product_information": product_summary,
            "benchmark_text": benchmark_text,
        }

        $.ajax({
            method: "POST",
            url: BASE_ENDPOINT_SANDBOX + "/swipe_benchmark",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(my_data),
            beforeSend: function() {$('#btnSwipe').val('Please wait...');
            }
        }).done((res)=>{
            debugger;
            $('#btnSwipe').val('(Re) Swipe');
            var request_id = res["request_id"];
            localStorage.setItem('request_id', request_id);
            pollRequestStatus(request_id);
        }
        ).fail((res)=>{
            console.log(res);
        })
    }); 
});