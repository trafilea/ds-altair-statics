function calculateButtons(able_to_regenerate, able_to_save_draft, able_to_generate) {
    if (able_to_regenerate) {
        $('#btnGenerate').text("Regenerate");
        $('#btnGenerate').removeClass("hide");
    }
    else {
        $('#btnGenerate').addClass("hide");
    }

    if (able_to_generate) {
        $('#btnGenerate').text("Generate");
        $('#btnGenerate').removeClass("hide");
    }

    if (able_to_save_draft) {
        $('#btnSaveDraft').removeClass("hide");
    }
    else {
        $('#btnSaveDraft').addClass("hide");
    }
}

// add drafts to draftContainer with this html
html_draft = '<label class="w-radio"><input type="radio" data-name="Radio" id="draft_##draft_id##" name="radio" value="Radio" class="w-form-formradioinput w-radio-input draft-item" data-draft="##draft_id##"><span class="radio-text w-form-label" for="radio">Draft ##draft_id##</span></label>'

// add benchmarks to benchmarkContainer with this html
html_benchmark = '<div id="benchmark_##angle_id##_##benchmark_id##" class="accordian-toggle w-dropdown-toggle" id="w-dropdown-toggle-1" aria-controls="w-dropdown-list-1" aria-haspopup="menu" aria-expanded="false" role="button" tabindex="0"> <div class="accordian-title-wrapper"> <div class="accordian-title">##benchmark_name##</div> <div class="accordian-icon w-embed"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M11.9998 15L7.75684 10.757L9.17184 9.34302L11.9998 12.172L14.8278 9.34302L16.2428 10.757L11.9998 15Z" fill="currentColor"></path> </svg></div> </div> </div> <nav class="accordian-dropdown w-dropdown-list" style="height: 0px;" id="w-dropdown-list-1" aria-labelledby="w-dropdown-toggle-1"> <div class="accordian-content" style="transform: translate3d(0px, -10px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d; opacity: 0;"> <div class="w-form" id="draftContainer_##angle_id##_##benchmark_id##"> </div> </div> </nav>'

// add angles to angleContainer with this html
html_angle = '<div id="angle_##angle_id##" data-hover="false" data-delay="0" class="dropdown-4 w-dropdown" style="max-width: 940px; display: block"> <div class="dropdown-toggle-3 w-dropdown-toggle" id="w-dropdown-toggle-0" aria-controls="w-dropdown-list-0" aria-haspopup="menu" aria-expanded="false" role="button" tabindex="0"> <div class="container-file"><img src="https://assets-global.website-files.com/651484c1d8627ae551b49727/653ad0a5e50fb15f43827452_file-05.svg" loading="lazy" alt="" class="image-3"></div> <div class="container-text--drop"> <div class="icon-dropdown w-icon-dropdown-toggle" aria-hidden="true"></div> <div class="text-block-dropdown" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">##angle_name##</div> </div> </div> <nav class="dropdown-list-3 w-dropdown-list" id="w-dropdown-list-0" aria-labelledby="w-dropdown-toggle-0"> <div class="accordian-wrapper"> <div id="benchmarkContainer_##angle_id##" data-delay="0" data-hover="false" class="accordian-item w-dropdown" style="max-width: 940px;"> </div> </div> </nav> </div>'

var angle_changed = false;

function showOverlay() {
    $("#overlay").show();
}

function hideOverlay() {
    $("#overlay").hide();
}
function getBenchmark(benchmark_id) {
    const formMethod = "POST";
    const formAction = BASE_ENDPOINT + "/get_benchmark";
    let my_data = {
        "benchmark_id": benchmark_id
    }


    endpoint = formAction
    return $.ajax({
        method: formMethod,
        url: endpoint,
        data: JSON.stringify(my_data),
        beforeSend: function () {//$('#btnSubmit').val('Please wait...');
        }
    }).done((res) => {
        return res["benchmark"];
    }
    ).fail((res) => {
        alert(res);
    }
    )
}

function getBenchmarks(ad_id) {
    const formMethod = "GET";
    const formAction = BASE_ENDPOINT + "/get_benchmarks?ad_id=" + ad_id;

    endpoint = formAction
    $.ajax({
        method: formMethod,
        url: endpoint,
        beforeSend: function () {
            //$('#btnSubmit').val('Please wait...');
        }
    })
        .done((res) => {
            // populate the product selector
            var benchmark_selector = document.getElementById("selBenchmark");
            var benchmarks = res["benchmarks"];
            for (var i = 0; i < benchmarks.length; i++) {
                var opt = document.createElement('option');
                opt.value = benchmarks[i]["benchmark_id"];
                opt.innerHTML = benchmarks[i]["benchmark_description"];
                opt.title = benchmarks[i]["benchmark_long_description"];
                benchmark_selector.appendChild(opt);

                // if it's the first one, populate the benchmark content
                if (i == 0) {
                    getBenchmark(benchmarks[i]["benchmark_id"]).then((benchmark_obj) => {
                        var link = benchmark_obj["benchmark"]["link"];
                        benchmark_obj = benchmark_obj["benchmark"]["benchmark_information"]["benchmark_content"];
                        
                        var benchmark_text = ""
                        for (let key in benchmark_obj) {
                            if (benchmark_obj.hasOwnProperty(key)) {
                                benchmark_text += benchmark_obj[key];
                            }
                        }
                        let benchmark_link = "<a href='" + link + "' target='_blank'>[Link]</a><br><br>"
                        $("#txtBenchmarkComparison").html(benchmark_link + (benchmark_text).replaceAll("%%", "<br><br>"));
                        // $("#txtBenchmarkComparison").html((benchmark_obj["hook"] + benchmark_obj["lead_structure"] + benchmark_obj["closing_cta"]).replaceAll("%%", "<br><br>").replaceAll("%%", "<br><br>"));
                    });
                }
            }

            benchmark_selector.addEventListener('change', function () {
                const selectedBenchmarkId = this.value;
                getBenchmark(selectedBenchmarkId).then((benchmark_obj) => {
                    benchmark_obj = benchmark_obj["benchmark"]["benchmark_information"]["benchmark_content"];
                    var benchmark_text = ""
                    for (let key in benchmark_obj) {
                        if (benchmark_obj.hasOwnProperty(key)) {
                            benchmark_text += benchmark_obj[key];
                        }
                    }
                    let benchmark_link = "<a href='" + benchmark_obj["link"] + "' target='_blank'>[Link]</a><br><br>"
                    $("#txtBenchmarkComparison").html(benchmark_link + (benchmark_text).replaceAll("%%", "<br><br>"));
                });
            });

        })
        .fail((res) => {
            alert(res);
        })
}

function addDraft(new_angle_id, new_angle_name, new_benchmark_id, new_benchmark_name, new_draft_id) {
    // check with jquery if the div called angle_(new_angle_id) already exists. if it doesn't append it
    // if it does, don't do anything.
    if ($('#angle_' + new_angle_id).length == 0) {
        // append the new angle
        var html_angle_new = html_angle.replaceAll("##angle_id##", new_angle_id);
        html_angle_new = html_angle_new.replaceAll("##angle_name##", new_angle_name);
        html_angle_new = html_angle_new.replaceAll("##benchmark_id##", new_benchmark_id);
        html_angle_new = html_angle_new.replaceAll("##benchmark_name##", new_benchmark_name);
        $('#angleContainer').append(html_angle_new);
    }


    if ($('#benchmark_' + new_angle_id + '_' + new_benchmark_id).length == 0) {
        // append the new benchmark
        var html_benchmark_new = html_benchmark.replaceAll("##angle_id##", new_angle_id);
        html_benchmark_new = html_benchmark_new.replaceAll("##benchmark_id##", new_benchmark_id);
        html_benchmark_new = html_benchmark_new.replaceAll("##benchmark_name##", new_benchmark_name);
        $('#benchmarkContainer_' + new_angle_id).append(html_benchmark_new);
    }


    if ($('#draft_' + new_draft_id).length == 0) {
        // append the new draft
        var html_draft_new = html_draft.replaceAll("##angle_id##", new_angle_id);
        html_draft_new = html_draft_new.replaceAll("##benchmark_id##", new_benchmark_id);
        html_draft_new = html_draft_new.replaceAll("##draft_id##", new_draft_id);
        $('#draftContainer_' + new_angle_id + '_' + new_benchmark_id).append(html_draft_new);
    }

    Webflow.destroy();
    Webflow.ready();
    Webflow.require('ix2').init();
}
