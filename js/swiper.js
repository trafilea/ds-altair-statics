var Webflow = Webflow || [];
Webflow.push(function () {

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
            json_data = JSON.parse(res);
            swiped_benchmark_str = json_data['choices'][0]['message']['content'];
            document.getElementById("txtBenchmarkSwiped").value = swiped_benchmark_str;
        }
        ).fail((res)=>{
            console.log(res);
        })
    }); 
});