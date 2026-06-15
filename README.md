# Robux Convertor

Minimal static Robux to USD/EUR converter for GitHub Pages.

## Rates

- Standard Rate: `$0.0038` per Robux (`$38` per `10,000` Robux)
- 18+ US Player Rate: `$0.0054` per Robux (`$54` per `10,000` Robux)
- Legacy/manual Rate: `$0.0035` per Robux (`$35` per `10,000` Robux)

The EUR conversion is calculated locally after syncing the latest USD/EUR rate from Frankfurter. If the API is unavailable, the page falls back to `0.92`.

## GitHub Pages

Publish the repository from the root folder and set GitHub Pages to deploy from the `main` branch root.
