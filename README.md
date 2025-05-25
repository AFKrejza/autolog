25S Cloud Application Architecture
Adam Krejza

Autolog





Notes
06/05/2025
To ignore database changes locally, run the following through Git Bash:

git update-index --assume-unchanged data/vehicles.json
git update-index --assume-unchanged data/entries.json

to revert:
git update-index --no-assume-unchanged