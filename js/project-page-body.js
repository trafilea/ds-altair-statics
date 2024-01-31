var Webflow = Webflow || [];
Webflow.push(function () {
		
	let able_to_regenerate = false;
    let able_to_save_draft = false;
    let able_to_generate = true;
    let able_to_generate_storyboard = false;
    calculateButtons(able_to_regenerate, able_to_save_draft, able_to_generate, able_to_generate_storyboard) 

    // on chage for the selBenchmark dropdown, get the benchmark content using the getBenchmark function
    $("#selBenchmark").change(function () {
        var benchmark_id = $("#selBenchmark").val();
        getBenchmark(benchmark_id).then((benchmark_obj) => {
            var link = benchmark_obj["link"];
            
            var benchmark_text = ""

            for (var i in benchmark_obj["benchmark_data"]["benchmark_information"]["benchmark_content"]) {
                for (var j in benchmark_obj["benchmark_data"]["benchmark_information"]["benchmark_content"][i]) {
                    for (var k in benchmark_obj["benchmark_data"]["benchmark_information"]["benchmark_content"][i][j]) {
                        benchmark_text += benchmark_obj["benchmark_data"]["benchmark_information"]["benchmark_content"][i][j][k]["audio_copy"] + "<br><br>";
                    }
                }
            }
            
            let benchmark_link = "<a href='" + link + "' target='_blank'>[Link]</a><br><br>"
            $("#txtBenchmarkComparison").html(benchmark_link + (benchmark_text).replaceAll("%%", "<br><br>"));
            // $("#txtBenchmarkComparison").html((benchmark_obj["hook"] + benchmark_obj["lead_structure"] + benchmark_obj["closing_cta"]).replaceAll("%%", "<br><br>").replaceAll("%%", "<br><br>"));
        });
    });

    var url = new URL(window.location.href);
    var ad_id = url.searchParams.get("ad_id");
    getBenchmarks(ad_id);

    var project_id = url.searchParams.get("project_id");
    var angle_id = url.searchParams.get("angle_id");

    const formMethod = "GET";
    const formAction = BASE_ENDPOINT + "/projects/" + project_id + "/angles/" + angle_id;
    endpoint = formAction
    $.ajax({
        method: formMethod,
        url: endpoint,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $('#btnGenerate').val('Please wait...');
        }
    })
    .done((res) => {
        console.log(res);
        var product = res["product_name"];
        var project_name = res["project_name"];
        var audience = res["audience_description"];
        var brand = res["brand_name"];
        var country = res["country_name"];
        var big_idea = res["insight"];


        document.getElementById("txtProjectName").innerHTML = project_name;
        document.getElementById("txtProduct").innerHTML = product;
        document.getElementById("txtAudience").innerHTML = audience;
        document.getElementById("txtBrand").innerHTML = brand;
        document.getElementById("txtCountry").innerHTML = country;
        document.getElementById("txtBigIdea").value = big_idea;
        
        $.ajax({
            method: "GET",
            url: BASE_ENDPOINT + "/projects/" + project_id + "/drafts",
            beforeSend: function() {//$('#btnSubmit').val('Please wait...');
            }
        }).done((res)=>{
            for (var i = 0; i < res["angles"].length; i++) {
                for (var j = 0; j < res["angles"][i]["benchmarks"].length; j++) {
                    for (var k = 0; k < res["angles"][i]["benchmarks"][j]["drafts"].length; k++) {
                        var draft = res["angles"][i]["benchmarks"][j]["drafts"][k];
                        var benchmark = res["angles"][i]["benchmarks"][j];
                        var angle = res["angles"][i];

                        new_angle_id = angle["angle_id"];
                        new_angle_name = angle["angle_name"].replaceAll("\"", "").replaceAll("\\", "");
                        new_benchmark_id = benchmark["benchmark_id"];
                        new_benchmark_name = benchmark["benchmark_name"];
                        new_draft_id = draft["draft_id"];

                        addDraft(new_angle_id, new_angle_name, new_benchmark_id, new_benchmark_name, new_draft_id);
                    }
                }
            }
        }
        ).fail((res)=>{
            alert("Error loading drafts")
        })
    }
    ).fail((res) => {
        alert(res);
    });

    // pollRequestStatus will poll the status of the request every 5 seconds, if the response is a failure it'll try again. otherwise it'll break
    function pollRequestStatus(request_id, show_storyboard) {
        // poll the status of the request every 5 seconds, the endpoint is BASE_ENDPOINT/get_results
        // if the response is a failure it'll try again. otherwise it'll break
        // only do the request every 5 seconds
        intervalId = setInterval(function () {
            $.ajax({
                method: "GET",
                url: BASE_ENDPOINT + "/projects/campaigns?request_id=" + request_id
            })
                .done((res) => {
                    console.log(res);
                    res = res["text"]
                    clearInterval(intervalId);

                    
                    hideOverlay();
                    
                    let able_to_regenerate = true;
                    let able_to_generate = false;
                    let able_to_save_draft = true;
                    let able_to_generate_storyboard = !show_storyboard;
                    calculateButtons(able_to_regenerate, able_to_save_draft, able_to_generate, able_to_generate_storyboard)
                    generateStoryboard(res, show_storyboard);

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
            "project_id": parseInt(project_id),
            "angle_id": parseInt(angle_id),
            "gpt_response": gpt_response,
            "benchmark_id": parseInt(benchmark_id),
            "angle": big_idea,
            "request_id": localStorage.getItem('request_id'),
        }
    
        $.ajax({
            method: "POST",
            url: BASE_ENDPOINT + "/drafts",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
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
            let able_to_generate_storyboard = false;
            calculateButtons(able_to_regenerate, able_to_save_draft, able_to_generate, able_to_generate_storyboard)
        }
        ).fail((res)=>{
            console.log(res);
        })
});

$('body').on('click', '.draft-item', function () {
        var draft_id = $(this).data('draft');

        const formMethod = "GET";
        const formAction = BASE_ENDPOINT + "/drafts/" + draft_id;

        $.ajax({
            method: formMethod,
            url: formAction,
        })
        .done((res) => {
            // check current radio button as selected
            $(this).prop("checked", true);
            // select the benchmark_id on the selBenchmark dropdown and trigger a change
            $("#selBenchmark").val(res["benchmark_id"]).trigger('change');
            // populate the txtResults div with the draft content (gpt_response)
            $("#txtResults").html(res["llm_response"].replaceAll("%%", "<br><br>"));
            // populate the big idea
            $("#txtBigIdea").val(res["angle_insight"]);

            var show_storyboard = res["llm_response"].includes("image1.png");
            
            able_to_regenerate = true;
            able_to_generate = false;
            able_to_save_draft = false;
            able_to_generate_storyboard = !show_storyboard;
            calculateButtons(able_to_regenerate, able_to_save_draft, able_to_generate, able_to_generate_storyboard)

            // FIXME: find a better way to determine if the storyboard should be shown

            generateStoryboard(res["llm_response"], show_storyboard);
        })
        .fail((res) => {
            console.log(res);
        })
    });

    $("#btnGenerateStoryboard").click(function () {
        var project_id = url.searchParams.get("project_id");
        var benchmark = $("#selBenchmark").val();
        var angle = $("#txtBigIdea").val();

        const formMethod = "POST";
        const formAction = BASE_ENDPOINT + "/projects/campaigns";

        $.ajax({
            method: formMethod,
            url: formAction,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                project_id: parseInt(project_id),
                benchmark_id: parseInt(benchmark),
                angle: angle,
                script_only: false,
                previous_request_id: localStorage.getItem('request_id'),
            }),
            beforeSend: function () {
                showOverlay();
            }
        })
            .done((res) => {
                console.log(res);
                var request_id = res["request_id"];
                localStorage.setItem('request_id', request_id);
                pollRequestStatus(request_id, true);
                
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
        const formAction = BASE_ENDPOINT + "/projects/campaigns";

        $.ajax({
            method: formMethod,
            url: formAction,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                project_id: parseInt(project_id),
                benchmark_id: parseInt(benchmark),
                angle: angle,
                script_only: true,
            }),
            beforeSend: function () {
                showOverlay();
            }
        })
            .done((res) => {
                console.log(res);
                var request_id = res["request_id"];
                localStorage.setItem('request_id', request_id);
                pollRequestStatus(request_id, false);
                
            })
            .fail((res) => {
                console.log(res);
            })
    });

});
