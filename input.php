<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Input</title>
<script>
    <?php $ver = rand(); ?>
    window.__DEV_BUILD__ = <?php echo $ver; ?>;
</script>
<link rel="stylesheet" href="css/tokens.css?v=<?php echo rand(); ?>">
<link rel="stylesheet" href="css/index.css?v=<?php echo $ver; ?>">
<script src="js/lucide.js"></script>
<script type="module" src="dist/components/input/uds-input.js?<?php echo rand(); ?>"></script>
<script type="module" src="dist/components/button/uds-button.js?<?php echo rand(); ?>"></script>
<script defer src="js/input-schema.js?v=<?php echo $ver; ?>"></script>
<script defer src="js/index.js?v=<?php echo $ver; ?>"></script>
</head>

<body>
    <div class="flex-table">
        <div class="row header" data-row="types">
            <div class="cell row-title"></div>

            <div class="group" data-group="primary">
                <div class="overtitle">Primary</div>
                <div class="cell" data-cell="small"></div>
                <div class="cell" data-cell="medium"></div>
                <div class="cell" data-cell="large"></div>
            </div>

            <div class="group" data-group="secondary">
                <div class="overtitle">Secondary</div>
                <div class="cell" data-cell="small"></div>
                <div class="cell" data-cell="medium"></div>
                <div class="cell" data-cell="large"></div>
            </div>

            <div class="group" data-group="danger">
                <div class="overtitle">Danger</div>
                <div class="cell" data-cell="small"></div>
                <div class="cell" data-cell="medium"></div>
                <div class="cell" data-cell="large"></div>
            </div>
        </div>

        <div class="row header" data-row="sizes">
            <div class="cell row-title"></div>

            <div class="group" data-group="primary">
                <div class="cell" data-cell="small">Small</div>
                <div class="cell" data-cell="medium">Medium</div>
                <div class="cell" data-cell="large">Large</div>
            </div>

            <div class="group" data-group="secondary">
                <div class="cell" data-cell="small">Small</div>
                <div class="cell" data-cell="medium">Medium</div>
                <div class="cell" data-cell="large">Large</div>
            </div>

            <div class="group" data-group="danger">
                <div class="cell" data-cell="small">Small</div>
                <div class="cell" data-cell="medium">Medium</div>
                <div class="cell" data-cell="large">Large</div>
            </div>
        </div>

        <!-- Filled -->
        <div class="period" data-period="filled">
            <div class="row">
                <div class="cell row-title">Filled</div>

                <div class="group" data-group="primary">
                    <div class="cell" data-cell="small">
                        <uds-input type="primary" variant="filled" size="small" placeholder="Placeholder" counter="3">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                    <div class="cell" data-cell="medium">
                        <uds-input type="primary" variant="filled" size="medium" placeholder="Placeholder" counter="3">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                    <div class="cell" data-cell="large">
                        <uds-input type="primary" variant="filled" size="large" placeholder="Placeholder" counter="3">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                </div>

                <div class="group" data-group="secondary">
                    <div class="cell" data-cell="small">
                        <uds-input type="secondary" variant="filled" size="small" placeholder="Placeholder" counter="3">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                    <div class="cell" data-cell="medium">
                        <uds-input type="secondary" variant="filled" size="medium" placeholder="Placeholder" counter="3">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                    <div class="cell" data-cell="large">
                        <uds-input type="secondary" variant="filled" size="large" placeholder="Placeholder" counter="3">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                </div>

                <div class="group" data-group="danger">
                    <div class="cell" data-cell="small">
                        <uds-input type="danger" variant="filled" size="small" placeholder="Placeholder" counter="3" error="Error">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                    <div class="cell" data-cell="medium">
                        <uds-input type="danger" variant="filled" size="medium" placeholder="Placeholder" counter="3" error="Error">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                    <div class="cell" data-cell="large">
                        <uds-input type="danger" variant="filled" size="large" placeholder="Placeholder" counter="3" error="Error">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                </div>
            </div>
        </div>

        <!-- Outline -->
        <div class="period">
            <div class="row">
                <div class="cell row-title">Outline</div>

                <div class="group" data-group="primary">
                    <div class="cell" data-cell="small">
                        <uds-input type="primary" variant="outline" size="small" placeholder="Placeholder" counter="3">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                    <div class="cell" data-cell="medium">
                        <uds-input type="primary" variant="outline" size="medium" placeholder="Placeholder" counter="3">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                    <div class="cell" data-cell="large">
                        <uds-input type="primary" variant="outline" size="large" placeholder="Placeholder" counter="3">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                </div>

                <div class="group" data-group="secondary">
                    <div class="cell" data-cell="small">
                        <uds-input type="secondary" variant="outline" size="small" placeholder="Placeholder" counter="3">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                    <div class="cell" data-cell="medium">
                        <uds-input type="secondary" variant="outline" size="medium" placeholder="Placeholder" counter="3">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                    <div class="cell" data-cell="large">
                        <uds-input type="secondary" variant="outline" size="large" placeholder="Placeholder" counter="3">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                </div>

                <div class="group" data-group="danger">
                    <div class="cell" data-cell="small">
                        <uds-input type="danger" variant="outline" size="small" placeholder="Placeholder" counter="3" error="Error">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                    <div class="cell" data-cell="medium">
                        <uds-input type="danger" variant="outline" size="medium" placeholder="Placeholder" counter="3" error="Error">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                    <div class="cell" data-cell="large">
                        <uds-input type="danger" variant="outline" size="large" placeholder="Placeholder" counter="3" error="Error">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                </div>
            </div>
        </div>

        <!-- Ghost -->
        <div class="period">
            <div class="row">
                <div class="cell row-title">Ghost</div>

                <div class="group" data-group="primary">
                    <div class="cell" data-cell="small">
                        <uds-input type="primary" variant="ghost" size="small" placeholder="Placeholder" counter="3">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                    <div class="cell" data-cell="medium">
                        <uds-input type="primary" variant="ghost" size="medium" placeholder="Placeholder" counter="3">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                    <div class="cell" data-cell="large">
                        <uds-input type="primary" variant="ghost" size="large" placeholder="Placeholder" counter="3">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                </div>

                <div class="group" data-group="secondary">
                    <div class="cell" data-cell="small">
                        <uds-input type="secondary" variant="ghost" size="small" placeholder="Placeholder" counter="3">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                    <div class="cell" data-cell="medium">
                        <uds-input type="secondary" variant="ghost" size="medium" placeholder="Placeholder" counter="3">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                    <div class="cell" data-cell="large">
                        <uds-input type="secondary" variant="ghost" size="large" placeholder="Placeholder" counter="3">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                </div>

                <div class="group" data-group="danger">
                    <div class="cell" data-cell="small">
                        <uds-input type="danger" variant="ghost" size="small" placeholder="Placeholder" counter="3" error="Error">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                    <div class="cell" data-cell="medium">
                        <uds-input type="danger" variant="ghost" size="medium" placeholder="Placeholder" counter="3" error="Error">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                    <div class="cell" data-cell="large">
                        <uds-input type="danger" variant="ghost" size="large" placeholder="Placeholder" counter="3" error="Error">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                </div>
            </div>
        </div>

        <!-- Text -->
        <div class="period">
            <div class="row">
                <div class="cell row-title">Text</div>

                <div class="group" data-group="primary">
                    <div class="cell" data-cell="small">
                        <uds-input type="primary" variant="text" size="small" placeholder="Placeholder" counter="3">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                    <div class="cell" data-cell="medium">
                        <uds-input type="primary" variant="text" size="medium" placeholder="Placeholder" counter="3">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                    <div class="cell" data-cell="large">
                        <uds-input type="primary" variant="text" size="large" placeholder="Placeholder" counter="3">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                </div>

                <div class="group" data-group="secondary">
                    <div class="cell" data-cell="small">
                        <uds-input type="secondary" variant="text" size="small" placeholder="Placeholder" counter="3">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                    <div class="cell" data-cell="medium">
                        <uds-input type="secondary" variant="text" size="medium" placeholder="Placeholder" counter="3">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                    <div class="cell" data-cell="large">
                        <uds-input type="secondary" variant="text" size="large" placeholder="Placeholder" counter="3">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                </div>

                <div class="group" data-group="danger">
                    <div class="cell" data-cell="small">
                        <uds-input type="danger" variant="text" size="small" placeholder="Placeholder" counter="3" error="Error">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                    <div class="cell" data-cell="medium">
                        <uds-input type="danger" variant="text" size="medium" placeholder="Placeholder" counter="3" error="Error">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                    <div class="cell" data-cell="large">
                        <uds-input type="danger" variant="text" size="large" placeholder="Placeholder" counter="3" error="Error">
                            <i slot="icon" data-lucide="search"></i>
                            <uds-button slot="button" type="secondary" variant="text" size="small">
                                <i slot="icon" data-lucide="mic"></i>
                            </uds-button>
                        </uds-input>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>