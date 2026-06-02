<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Toggle</title>
<script>
    <?php $ver = rand(); ?>
    window.__DEV_BUILD__ = <?php echo $ver; ?>;
</script>
<link rel="stylesheet" href="css/tokens.css?v=<?php echo $ver; ?>">
<link rel="stylesheet" href="css/index.css?v=<?php echo $ver; ?>">
<script src="js/lucide.js"></script>
<script type="module" src="dist/components/toggle/uds-toggle.js?v=<?php echo $ver; ?>"></script>
<script defer src="js/toggle-schema.js?v=<?php echo $ver; ?>"></script>
<script defer src="js/index.js?v=<?php echo $ver; ?>"></script>
</head>

<body id="page-toggle">
    <div class="flex-table">
        <div class="row header" data-row="types">
            <div class="group" data-group="primary">
                <div class="cell" data-cell="small">Small</div>
                <div class="cell" data-cell="medium">Medium</div>
                <div class="cell" data-cell="large">Large</div>
            </div>
        </div>

        <div class="period" data-period="filled">
            <div class="row">
                <div class="cell row-title">
                    <uds-toggle size="small" counter="3">
                        Label
                        <i slot="icon-right" data-lucide="info"></i>
                    </uds-toggle>
                </div>

                <div class="cell row-title">
                    <uds-toggle size="medium" counter="3">
                        Label
                        <i slot="icon-right" data-lucide="info"></i>
                    </uds-toggle>
                </div>

                <div class="cell row-title">
                    <uds-toggle size="large" counter="3">
                        Label
                        <i slot="icon-right" data-lucide="info"></i>
                    </uds-toggle>
                </div>
            </div>
        </div>
    </div>

</body>
</html>