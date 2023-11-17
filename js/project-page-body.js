var Webflow = Webflow || [];
Webflow.push(function () {
		
	let able_to_regenerate = false;
    let able_to_save_draft = false;
    let able_to_generate = true;
    calculateButtons(able_to_regenerate, able_to_save_draft, able_to_generate) 

    // on chage for the selBenchmark dropdown, get the benchmark content using the getBenchmark function
    $("#selBenchmark").change(function () {
        var benchmark_id = $("#selBenchmark").val();
        getBenchmark(benchmark_id);
    });

    var url = new URL(window.location.href);
    var ad_id = url.searchParams.get("ad_id");
    getBenchmarks(ad_id);

    var project_id = url.searchParams.get("project_id");
    var angle_id = url.searchParams.get("angle_id");

    const formMethod = "POST";
    const formAction = BASE_ENDPOINT + "/get_project";
    endpoint = formAction
    $.ajax({
        method: formMethod,
        url: endpoint,
        data: JSON.stringify({
            project_id: project_id,
            angle_id: angle_id
        }),
        beforeSend: function () {
            $('#btnGenerate').val('Please wait...');
        }
    })
    .done((res) => {
        res = res["response"][0]
        console.log(res);
        var product = res["product_name"];
        var project_name = res["project_name"];
        var audience = res["audience_description"];
        var brand = res["brand_name"];
        var country = res["country_name"];
        var big_idea = res["angle_insight"];


        document.getElementById("txtProjectName").innerHTML = project_name;
        document.getElementById("txtProduct").innerHTML = product;
        document.getElementById("txtAudience").innerHTML = audience;
        document.getElementById("txtBrand").innerHTML = brand;
        document.getElementById("txtCountry").innerHTML = country;
        document.getElementById("txtBigIdea").value = big_idea;
        
        let my_data = {
            "project_id": project_id
        }

        $.ajax({
            method: "POST",
            url: BASE_ENDPOINT + "/get_drafts",
            data: JSON.stringify(my_data),
            beforeSend: function() {//$('#btnSubmit').val('Please wait...');
            }
        }).done((res)=>{
            for (i = 0; i < res.length; i++) {
                new_angle_id = res[i].angle_id
                new_angle_name = res[i].angle_name.replaceAll("\"", "").replaceAll("\\", "");
                new_benchmark_id = res[i].benchmark_id
                new_benchmark_name = res[i].benchmark_description
                new_draft_id = res[i].draft_id

                addDraft(new_angle_id, new_angle_name, new_benchmark_id, new_benchmark_name, new_draft_id)
            }
        }
        ).fail((res)=>{
            alert("Errir loading drafts")
        })
    }
    ).fail((res) => {
        alert(res);
    });

    // pollRequestStatus will poll the status of the request every 5 seconds, if the response is a failure it'll try again. otherwise it'll break
    function pollRequestStatus(request_id) {
        // poll the status of the request every 5 seconds, the endpoint is BASE_ENDPOINT/get_results
        // if the response is a failure it'll try again. otherwise it'll break
        // only do the request every 5 seconds
        intervalId = setInterval(function () {
            $.ajax({
                method: "POST",
                url: BASE_ENDPOINT + "/get_results",
                data: JSON.stringify(
                    {
                        request_id: request_id
                    }),
                beforeSend: function () {
                    //$('#btnSubmit').val('Please wait...');
                }
            })
                .done((res) => {
                    console.log(res);
                    clearInterval(intervalId);

                    $("#txtResults").html("<br><br><br><br><br>" + res.replaceAll("%%", "<br><br>"));
                    hideOverlay();
                    
                    let able_to_regenerate = true;
                    let able_to_generate = false;
                    let able_to_save_draft = true;
                    calculateButtons(able_to_regenerate, able_to_save_draft, able_to_generate)
                })
                .fail((res) => {
                    console.log(res);
                })
        }, 5000);
    }
    
    $('#txtBigIdea').change(function() {
        angle_changed = true;
    });
    
    $("#btnSaveDraft").click(function(){
    var gpt_response = $('#txtResults').html();
    var benchmark_id = $('#selBenchmark').val();

    // get project_id and angle_id from url parameters
    var urlParams = new URLSearchParams(window.location.search);
    var project_id = urlParams.get('project_id');
		var angle_id = null;
    if (angle_changed == false) {
        angle_id = urlParams.get('angle_id');
    }
    
    var big_idea = null;
    if (angle_changed == true) {
        big_idea = $('#txtBigIdea').val()
    }

    my_data = {
        "project_id": project_id,
        "angle_id": angle_id,
        "gpt_response": gpt_response,
        "benchmark_id": benchmark_id,
        "angle": big_idea,
        "request_id": localStorage.getItem('request_id'),
    }

    $.ajax({
        method: "POST",
        url: BASE_ENDPOINT + "/save_draft",
        data: JSON.stringify(my_data),
        beforeSend: function() {//$('#btnSubmit').val('Please wait...');
        }
    }).done((res)=>{
        debugger;

        var new_angle_id = res['angle_id'];
        var new_benchmark_id = res['benchmark_id'];
        var new_benchmark_name = res['benchmark_name'];
        var new_draft_id = res['draft_id'];
        var new_angle_name = res['angle_name'].replaceAll("\"", "").replaceAll("\\", "");
        
        addDraft(new_angle_id, new_angle_name, new_benchmark_id, new_benchmark_name, new_draft_id);
        
        let able_to_regenerate = true;
        let able_to_generate = false;
        let able_to_save_draft = false;
        calculateButtons(able_to_regenerate, able_to_save_draft, able_to_generate)
    }
    ).fail((res)=>{
        console.log(res);
    })
});

$('body').on('click', '.draft-item', function () {
        var draft_id = $(this).data('draft');

        const formMethod = "POST";
        const formAction = BASE_ENDPOINT + "/get_draft";

        $.ajax({
            method: formMethod,
            url: formAction,
            data: JSON.stringify({
                draft_id
            })
        })
        .done((res) => {
            // check current radio button as selected
            $(this).prop("checked", true);
            // select the benchmark_id on the selBenchmark dropdown and trigger a change
            $("#selBenchmark").val(res["benchmark_id"]).trigger('change');
            // populate the txtResults div with the draft content (gpt_response)
            $("#txtResults").html(res["gpt_response"].replaceAll("%%", "<br><br>"));
            // populate the big idea
            $("#txtBigIdea").val(res["angle_insight"]);
            
            able_to_regenerate = true;
            able_to_generate = false;
            able_to_save_draft = false;
            calculateButtons(able_to_regenerate, able_to_save_draft, able_to_generate)
            
        })
        .fail((res) => {
            console.log(res);
        })
    });

    $("#btnGenerate").click(function () {
        var project_id = url.searchParams.get("project_id");
        var benchmark = $("#selBenchmark").val();
        var angle = $("#txtBigIdea").val();

        const formMethod = "POST";
        const formAction = BASE_ENDPOINT + "/ask";

        $.ajax({
            method: formMethod,
            url: formAction,
            data: JSON.stringify({
                project_id: project_id,
                benchmark_id: benchmark,
                angle: angle
            }),
            beforeSend: function () {
                showOverlay();
            }
        })
            .done((res) => {
                console.log(res);
                var request_id = res["request_id"];
                localStorage.setItem('request_id', request_id);
                pollRequestStatus(request_id);
                
            })
            .fail((res) => {
                console.log(res);
            })
    });

});
