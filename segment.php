<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Segment</title>
<script>
    <?php $ver = rand(); ?>
    window.__DEV_BUILD__ = <?php echo $ver; ?>;
</script>
<link rel="stylesheet" href="css/tokens.css?v=<?php echo $ver; ?>">
<link rel="stylesheet" href="css/index.css?v=<?php echo $ver; ?>">
<script src="js/lucide.js"></script>
<script type="module" src="dist/components/button/uds-button.js?v=<?php echo $ver; ?>"></script>
<script type="module" src="dist/components/segment/uds-segment.js?v=<?php echo $ver; ?>"></script>
<script defer src="js/segment-schema.js?v=<?php echo $ver; ?>"></script>
<script defer src="js/index.js?v=<?php echo $ver; ?>"></script>
</head>

<body id="page-segment">
    <div class="flex-table">
        <div class="row header" data-row="types">
            <div class="cell row-title"></div>

            <div class="group" data-group="small">
                <div class="overtitle">Small</div>
            </div>

            <div class="group" data-group="medium">
                <div class="overtitle">Medium</div>
            </div>

            <div class="group" data-group="large">
                <div class="overtitle">Large</div>
            </div>
        </div>

        <!-- Primary -->
        <!-- Filled -->
        <div class="period-group" data-period-group="primary">
            <div class="period" data-period="filled">
                <div class="period-title">Primary</div>

                <div class="row">
                    <div class="cell row-title">Filled</div>

                    <div class="group" data-group="primary">
                        <div class="cell" data-cell="small">
                            <uds-segment type="primary" size="small" variant="filled" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                        <div class="cell" data-cell="medium">
                            <uds-segment type="primary" size="medium" variant="filled" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                        <div class="cell" data-cell="large">
                            <uds-segment type="primary" size="large" variant="filled" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Outline -->
            <div class="period" data-period="outline">
                <div class="row">
                    <div class="cell row-title">Outline</div>

                    <div class="group" data-group="primary">
                        <div class="cell" data-cell="small">
                            <uds-segment type="primary" size="small" variant="outline" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                        <div class="cell" data-cell="medium">
                            <uds-segment type="primary" size="medium" variant="outline" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                        <div class="cell" data-cell="large">
                            <uds-segment type="primary" size="large" variant="outline" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Ghost -->
            <div class="period" data-period="ghost">
                <div class="row">
                    <div class="cell row-title">Ghost</div>

                    <div class="group" data-group="primary">
                        <div class="cell" data-cell="small">
                            <uds-segment type="primary" size="small" variant="ghost" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                        <div class="cell" data-cell="medium">
                            <uds-segment type="primary" size="medium" variant="ghost" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                        <div class="cell" data-cell="large">
                            <uds-segment type="primary" size="large" variant="ghost" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Text -->
            <div class="period" data-period="text">
                <div class="row">
                    <div class="cell row-title">Text</div>

                    <div class="group" data-group="primary">
                        <div class="cell" data-cell="small">
                            <uds-segment type="primary" size="small" variant="text" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                        <div class="cell" data-cell="medium">
                            <uds-segment type="primary" size="medium" variant="text" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                        <div class="cell" data-cell="large">
                            <uds-segment type="primary" size="large" variant="text" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <!-- Secondary -->
        <!-- Filled -->
        <div class="period-group" data-period-group="secondary">
            <div class="period" data-period="filled">
                <div class="period-title">Secondary</div>

                <div class="row">
                    <div class="cell row-title">Filled</div>

                    <div class="group" data-group="secondary">
                        <div class="cell" data-cell="small">
                            <uds-segment type="secondary" size="small" variant="filled" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                        <div class="cell" data-cell="medium">
                            <uds-segment type="secondary" size="medium" variant="filled" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                        <div class="cell" data-cell="large">
                            <uds-segment type="secondary" size="large" variant="filled" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Outline -->
            <div class="period" data-period="outline">
                <div class="row">
                    <div class="cell row-title">Outline</div>

                    <div class="group" data-group="secondary">
                        <div class="cell" data-cell="small">
                            <uds-segment type="secondary" size="small" variant="outline" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                        <div class="cell" data-cell="medium">
                            <uds-segment type="secondary" size="medium" variant="outline" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                        <div class="cell" data-cell="large">
                            <uds-segment type="secondary" size="large" variant="outline" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Ghost -->
            <div class="period" data-period="ghost">
                <div class="row">
                    <div class="cell row-title">Ghost</div>

                    <div class="group" data-group="secondary">
                        <div class="cell" data-cell="small">
                            <uds-segment type="secondary" size="small" variant="ghost" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                        <div class="cell" data-cell="medium">
                            <uds-segment type="secondary" size="medium" variant="ghost" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                        <div class="cell" data-cell="large">
                            <uds-segment type="secondary" size="large" variant="ghost" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Text -->
            <div class="period" data-period="text">
                <div class="row">
                    <div class="cell row-title">Text</div>

                    <div class="group" data-group="secondary">
                        <div class="cell" data-cell="small">
                            <uds-segment type="secondary" size="small" variant="text" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                        <div class="cell" data-cell="medium">
                            <uds-segment type="secondary" size="medium" variant="text" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                        <div class="cell" data-cell="large">
                            <uds-segment type="secondary" size="large" variant="text" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <!-- Danger -->
        <!-- Filled -->
        <div class="period-group" data-period-group="danger">
            <div class="period" data-period="filled">
                <div class="period-title">Danger</div>

                <div class="row">
                    <div class="cell row-title">Filled</div>

                    <div class="group" data-group="danger">
                        <div class="cell" data-cell="small">
                            <uds-segment type="danger" size="small" variant="filled" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                        <div class="cell" data-cell="medium">
                            <uds-segment type="danger" size="medium" variant="filled" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                        <div class="cell" data-cell="large">
                            <uds-segment type="danger" size="large" variant="filled" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Outline -->
            <div class="period" data-period="outline">
                <div class="row">
                    <div class="cell row-title">Outline</div>

                    <div class="group" data-group="danger">
                        <div class="cell" data-cell="small">
                            <uds-segment type="danger" size="small" variant="outline" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                        <div class="cell" data-cell="medium">
                            <uds-segment type="danger" size="medium" variant="outline" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                        <div class="cell" data-cell="large">
                            <uds-segment type="danger" size="large" variant="outline" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Ghost -->
            <div class="period" data-period="ghost">
                <div class="row">
                    <div class="cell row-title">Ghost</div>

                    <div class="group" data-group="danger">
                        <div class="cell" data-cell="small">
                            <uds-segment type="danger" size="small" variant="ghost" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                        <div class="cell" data-cell="medium">
                            <uds-segment type="danger" size="medium" variant="ghost" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                        <div class="cell" data-cell="large">
                            <uds-segment type="danger" size="large" variant="ghost" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Text -->
            <div class="period" data-period="text">
                <div class="row">
                    <div class="cell row-title">Text</div>

                    <div class="group" data-group="danger">
                        <div class="cell" data-cell="small">
                            <uds-segment type="danger" size="small" variant="text" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                        <div class="cell" data-cell="medium">
                            <uds-segment type="danger" size="medium" variant="text" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                        <div class="cell" data-cell="large">
                            <uds-segment type="danger" size="large" variant="text" value="day">
                                <uds-button value="day">Day</uds-button>
                                <uds-button value="week">Week</uds-button>
                                <uds-button value="month">Month</uds-button>
                            </uds-segment>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>