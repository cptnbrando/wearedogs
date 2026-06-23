#!/bin/bash

# ==============================================================================
# TV Show Sampler Downloader (Internet Archive)
# Saves files into public/batman/ for local low-latency media testing.
# ==============================================================================

# Resolve target destination folder relative to the script location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST_DIR="$(cd "$SCRIPT_DIR" 2>/dev/null && pwd || echo "$SCRIPT_DIR")"

# Base URL for Internet Archive downloads
BASE_URL="https://archive.org/download/dc-batman-beyond-1999-season-one_202309"

# Season 1 File List (13 Episodes)
s1_files=(
    "S01 E01 - Rebirth, Part 1 of 2.ia.mp4"
    "S01 E02 - Rebirth, Part 2 of 2.ia.mp4"
    "S01 E03 - Black Out.ia.mp4"
    "S01 E04 - Golem.ia.mp4"
    "S01 E05 - Meltdown.ia.mp4"
    "S01 E06 - Heroes.ia.mp4"
    "S01 E07 - Shriek.ia.mp4"
    "S01 E08 - Dead Man's Hand.ia.mp4"
    "S01 E09 - The Winning Edge.ia.mp4"
    "S01 E10 - Spellbound.ia.mp4"
    "S01 E11 - Disappearing Inque.ia.mp4"
    "S01 E12 - A Touch of Curare.ia.mp4"
    "S01 E13 - Ascension.ia.mp4"
)

# Season 2 File List (26 Episodes)
s2_files=(
    "S02 E01 - Splicers.ia.mp4"
    "S02 E02 - Earth Mover.ia.mp4"
    "S02 E03 - Joyride.ia.mp4"
    "S02 E04 - Lost Soul.ia.mp4"
    "S02 E05 - Hidden Agenda.ia.mp4"
    "S02 E06 - Bloodsport.ia.mp4"
    "S02 E07 - Once Burned.ia.mp4"
    "S02 E08 - Hooked Up.ia.mp4"
    "S02 E09 - Rats.ia.mp4"
    "S02 E10 - Mind Games.ia.mp4"
    "S02 E11 - Revenant.ia.mp4"
    "S02 E12 - Babel.ia.mp4"
    "S02 E13 - Terry's Friend Dates a Robot.ia.mp4"
    "S02 E14 - Eyewitness.ia.mp4"
    "S02 E15 - Final Cut.ia.mp4"
    "S02 E16 - The Last Resort.ia.mp4"
    "S02 E17 - Armory.ia.mp4"
    "S02 E18 - Sneak Peek.ia.mp4"
    "S02 E19 - The Eggbaby.ia.mp4"
    "S02 E20 - Zeta.ia.mp4"
    "S02 E21 - Plague.ia.mp4"
    "S02 E22 - April Moon.ia.mp4"
    "S02 E23 - Sentries of the Last Cosmos.ia.mp4"
    "S02 E24 - Payback.ia.mp4"
    "S02 E25 - Where's Terry.ia.mp4"
    "S02 E26 - Ace in the Hole.ia.mp4"
)

# Season 3 File List (13 Episodes)
s3_files=(
    "S03 E01 - King's Ransom.ia.mp4"
    "S03 E02 - Untouchable.ia.mp4"
    "S03 E03 - Inqueling.ia.mp4"
    "S03 E04 - Big Time.ia.mp4"
    "S03 E05 - Out of the Past.ia.mp4"
    "S03 E06 - Speak No Evil.ia.mp4"
    "S03 E07 - The Call, Part 1 of 2.ia.mp4"
    "S03 E08 - The Call, Part 2 of 2.ia.mp4"
    "S03 E09 - Betrayal.ia.mp4"
    "S03 E10 - The Curse of the Kobra, Part 1 of 2.ia.mp4"
    "S03 E11 - The Curse of the Kobra, Part 2 of 2.ia.mp4"
    "S03 E12 - Countdown.ia.mp4"
    "S03 E13 - Unmasked.ia.mp4"
)

# Extras & Crossovers File List (5 Episodes)
extras_files=(
    "Crossovers (2001-05)/1. The ZETA Project - S01 E08 - Shadows.ia.mp4"
    "Crossovers (2001-05)/2. Static Shock - S04 E01 - Future Shock.mp4"
    "Crossovers (2001-05)/3. Justice League Unlimited - S03 E12 - The Once and Future Thing, Part 1.ia.mp4"
    "Crossovers (2001-05)/4. Justice League Unlimited - S03 E13 - The Once and Future Thing, Part 2.ia.mp4"
    "Crossovers (2001-05)/5. Justice League Unlimited - S04 E13 - Epilogue.ia.mp4"
)

# Download Helper
download_file() {
    local file="$1"
    local encoded_file="${file// /%20}"
    local dest_path="$DEST_DIR/$file"
    local dest_parent="$(dirname "$dest_path")"

    # Make parent folders if downloading crossovers
    mkdir -p "$dest_parent"

    echo "Downloading: $file"
    echo "Destination: $dest_path"

    # Use curl with -L (follow redirects) and -C - (resume downloads)
    curl -L -C - -o "$dest_path" "$BASE_URL/$encoded_file"

    if [ $? -eq 0 ]; then
        echo "✓ Successfully downloaded: $file"
    else
        echo "Error downloading: $file"
    fi
    echo "------------------------------------------"
}

# ==============================================================================
# Interactive Menu
# ==============================================================================

clear
echo "=========================================="
echo "      TV SHOW SAMPLER DOWNLOADER          "
echo "=========================================="
echo "1) Batman Beyond (1999)"
read -p "Select a show to download [1]: " show_choice
show_choice=${show_choice:-1}

if [ "$show_choice" != "1" ]; then
    echo "Invalid choice. Exiting."
    exit 1
fi

echo ""
echo "What would you like to download for Batman Beyond?"
echo "1) Season 1 (Individual Episode / Range)"
echo "2) Season 2 (Individual Episode / Range)"
echo "3) Season 3 (Individual Episode / Range)"
echo "4) Entire Seasons (Choose which season to download entirely)"
echo "5) All (All Seasons + Extras)"
read -p "Enter option [1-5] (Default 1): " option
option=${option:-1}

# Ensure target folder is created
mkdir -p "$DEST_DIR"

if [ "$option" = "1" ] || [ "$option" = "2" ] || [ "$option" = "3" ]; then
    case "$option" in
        1) files_arr=("${s1_files[@]}"); season_name="Season 1";;
        2) files_arr=("${s2_files[@]}"); season_name="Season 2";;
        3) files_arr=("${s3_files[@]}"); season_name="Season 3";;
    esac

    total_eps=${#files_arr[@]}
    echo ""
    echo "$season_name has $total_eps episodes."
    read -p "Enter episode or range (e.g. 1 or 1-5): " start_input
    start_input=${start_input:-1}

    # Parse range input or single episode number
    if [[ "$start_input" =~ ^([0-9]+)-([0-9]+)$ ]]; then
        start_ep="${BASH_REMATCH[1]}"
        end_ep="${BASH_REMATCH[2]}"
    elif [[ "$start_input" =~ ^[0-9]+$ ]]; then
        start_ep="$start_input"
        read -p "Enter ending episode number (1-$total_eps) [or press Enter for single episode]: " end_input
        if [ -z "$end_input" ]; then
            end_ep="$start_ep"
        else
            end_ep="$end_input"
        fi
    else
        echo "Invalid format. Exiting."
        exit 1
    fi

    # Basic numeric validations
    if ! [[ "$start_ep" =~ ^[0-9]+$ ]] || ! [[ "$end_ep" =~ ^[0-9]+$ ]]; then
        echo "Invalid episode range integers. Exiting."
        exit 1
    fi

    if [ "$start_ep" -lt 1 ] || [ "$end_ep" -gt "$total_eps" ] || [ "$start_ep" -gt "$end_ep" ]; then
        echo "Invalid boundaries. Exiting."
        exit 1
    fi

    echo "Downloading $season_name episodes $start_ep through $end_ep..."
    for ((i=start_ep-1; i<end_ep; i++)); do
        download_file "${files_arr[i]}"
    done
elif [ "$option" = "4" ]; then
    echo ""
    echo "Select which season to download entirely:"
    echo "1) Season 1"
    echo "2) Season 2"
    echo "3) Season 3"
    echo "4) Extras & Crossovers"
    read -p "Enter season choice to download entirely [1-4]: " target_season
    case "$target_season" in
        1)
            echo "Downloading Season 1 entirely..."
            for file in "${s1_files[@]}"; do
                download_file "$file"
            done
            ;;
        2)
            echo "Downloading Season 2 entirely..."
            for file in "${s2_files[@]}"; do
                download_file "$file"
            done
            ;;
        3)
            echo "Downloading Season 3 entirely..."
            for file in "${s3_files[@]}"; do
                download_file "$file"
            done
            ;;
        4)
            echo "Downloading Extras & Crossovers entirely..."
            for file in "${extras_files[@]}"; do
                download_file "$file"
            done
            ;;
        *)
            echo "Invalid selection. Exiting."
            exit 1
            ;;
    esac
elif [ "$option" = "5" ]; then
    echo "Downloading All Seasons and Extras..."
    for file in "${s1_files[@]}" "${s2_files[@]}" "${s3_files[@]}" "${extras_files[@]}"; do
        download_file "$file"
    done
else
    echo "Invalid option. Exiting."
    exit 1
fi

echo "Done!"
