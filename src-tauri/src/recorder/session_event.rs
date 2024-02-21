use serde::{Deserialize, Serialize};

use crate::game_data::GameId;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum SubscriptionResponse {
    Session(SessionEventData),
    Eog {}, // curly braces are important - else deserialization fails if the data doesn't match SessionEventData
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SessionEventData {
    pub game_data: GameData,
    pub phase: GamePhase,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
pub enum GamePhase {
    None,
    Lobby,
    Matchmaking,
    CheckedIntoTournament,
    ReadyCheck,
    ChampSelect,
    GameStart,
    FailedToLaunch,
    InProgress,
    Reconnect,
    WaitingForStats,
    PreEndOfGame,
    EndOfGame,
    TerminatedInError,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GameData {
    pub queue: Queue,
    pub game_id: GameId,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Queue {
    pub id: i64,
    pub is_ranked: bool,
}

// generated from https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/queues.json
impl std::fmt::Display for Queue {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let name = match self.id {
            6080 => "Set Queue 2",
            1021 => "1v1",
            1020 => "One For All",
            6090 => "Set Queue 3",
            1023 => "2v2",
            1022 => "3v3",
            1024 => "4v4",
            1050 => "Odyssey (Crewmember)",
            1051 => "Odyssey Medium 1v0",
            14 => "Normal",
            440 => "Ranked Flex",
            441 => "Ranked Flex",
            442 => "Ranked Flex",
            422 => "Ranked Solo/Duo",
            1102 => "2v0 (Ranked)",
            31 => "Intro",
            452 => "1v1",
            420 => "Ranked Solo/Duo",
            451 => "3v3",
            1100 => "Teamfight Tactics (Ranked)",
            33 => "Intermediate",
            421 => "Ranked Solo/Duo",
            450 => "ARAM",
            1101 => "1v0 (Ranked)",
            32 => "Beginner",
            92 => "Level 100 Gauntlet",
            35 => "Beginner",
            91 => "The Teemoing",
            34 => "Intro",
            90 => "The Teemoing",
            1032 => "Odyssey Intro 3v0",
            431 => "Normal",
            97 => "Ascension",
            36 => "Intermediate",
            430 => "Normal",
            96 => "Ascension",
            1030 => "Odyssey (Intro)",
            41 => "Team",
            433 => "Normal",
            318 => "AR Ultra Rapid Fire",
            2020 => "Tutorial Part 3",
            1031 => "Odyssey Intro 1v0",
            460 => "Normal",
            42 => "Team",
            432 => "Normal",
            319 => "AR Ultra Rapid Fire",
            461 => "Twisted Treeline 1v1",
            901 => "ARURF 1v1",
            900 => "AR Ultra Rapid Fire",
            903 => "ARURF 3v3",
            902 => "ARURF 2v2",
            904 => "ARURF 4v4",
            314 => "Nexus Siege",
            315 => "Nexus Siege",
            301 => "Legend of the Poro King",
            1120 => "Teamfight Tactics (Normal Hyper Roll)",
            316 => "Definitely Not Dominion",
            300 => "Legend of the Poro King",
            1121 => "1v0 (Normal Hyper Roll)",
            317 => "Definitely Not Dominion",
            1122 => "2v0 (Normal Hyper Roll)",
            1132 => "2v0 (Hyper Roll)",
            990 => "Invasion (Onslaught)",
            1131 => "1v0 (Hyper Roll)",
            1130 => "Teamfight Tactics (Hyper Roll)",
            981 => "Invasion (Normal)",
            980 => "Invasion (Normal)",
            982 => "Invasion (Normal)",
            831 => "Bots Intro 3v3",
            921 => "Legend of the Poro King",
            830 => "Intro",
            920 => "Legend of the Poro King",
            1300 => "Nexus Blitz",
            832 => "Bots Intro 1v1",
            1301 => "1v1",
            1302 => "2v2",
            1303 => "3v3",
            1304 => "4v4",
            840 => "Beginner",
            910 => "Ascension",
            841 => "Bots Easy 3v3",
            911 => "Ascension",
            842 => "Bots Easy 1v1",
            2200 => "Teamfight Tactics (Normal)",
            100 => "Normal",
            820 => "Beginner",
            701 => "Clash",
            700 => "Clash",
            1704 => "4v0 (Arena)",
            1700 => "Arena",
            6040 => "Set Queue 1",
            1701 => "1v0 (Arena)",
            1710 => "Arena",
            6050 => "Set Queue 2",
            1090 => "Teamfight Tactics (Normal)",
            6020 => "Set Queue 2",
            1091 => "1v0",
            1092 => "2v0",
            1093 => "3v0",
            470 => "Ranked Flex",
            1094 => "4v0",
            62 => "ARAM",
            63 => "ARAM",
            6030 => "Set Queue 3",
            400 => "Normal",
            401 => "Normal",
            402 => "Normal",
            64 => "ARAM",
            403 => "Normal",
            413 => "Ranked",
            65 => "ARAM",
            1902 => "URF 2v2",
            1041 => "Odyssey Easy 1v0",
            412 => "Ranked",
            1903 => "URF 3v3",
            1040 => "Odyssey (Cadet)",
            411 => "Ranked",
            1900 => "Ultra Rapid Fire",
            0 => "Custom",
            410 => "Ranked",
            1901 => "URF 1v1",
            1 => "Normal",
            1010 => "Snow Battle ARURF",
            2 => "Normal",
            1011 => "Snow Battle ARURF",
            1012 => "Snow Battle ARURF",
            1160 => "Teamfight Tactics (Double Up Workshop)",
            1904 => "URF 4v4",
            1161 => "2v0 (Double Up)",
            1070 => "Odyssey (Onslaught)",
            1162 => "4v0 (Double Up)",
            1001 => "Overcharge",
            1071 => "Odyssey Uber 1v0",
            321 => "Blood Moon",
            1000 => "Overcharge",
            1172 => "2v0 (Fortune's Favor)",
            320 => "Blood Moon",
            8 => "Normal",
            1171 => "1v0 (Fortune's Favor)",
            9 => "Ranked Flex",
            1170 => "Teamfight Tactics (Fortune's Favor)",
            1061 => "Odyssey Hard 1v0",
            325 => "ARSR",
            1060 => "Odyssey (Captain)",
            324 => "ARSR",
            1175 => "1v7 Bots (Fortune's Favor)",
            1111 => "TFT Simulation",
            1142 => "2v0 (Normal Double Up)",
            1110 => "Teamfight Tactics (Tutorial)",
            1143 => "4v0 (Normal Double Up)",
            1140 => "Teamfight Tactics (Normal Double Up)",
            490 => "Quickplay",
            1141 => "Teamfight Tactics (Double Up 1v7 Bots)",
            52 => "Beginner",
            1151 => "2v0 (Double Up)",
            1150 => "Teamfight Tactics (Double Up Workshop)",
            1182 => "2v0 (Soul Brawl)",
            1152 => "4v0 (Double Up)",
            1180 => "Teamfight Tactics (Soul Brawl)",
            1181 => "1v0 (Soul Brawl)",
            1195 => "1v7 Bots (Choncc's Treasure)",
            2000 => "Tutorial Part 1",
            970 => "Hexakill",
            1185 => "1v7 Bots (Soul Brawl)",
            1191 => "1v0 (Choncc's Treasure)",
            971 => "Hexakill 1v1",
            1190 => "Teamfight Tactics (Choncc's Treasure)",
            1192 => "2v0 (Choncc's Treasure)",
            2010 => "Tutorial Part 2",
            961 => "The Teemoing",
            960 => "The Teemoing",
            930 => "ARAM",
            931 => "ARAM",
            950 => "Level 100 Gauntlet",
            1201 => "1v1",
            951 => "Level 100 Gauntlet",
            1200 => "Nexus Blitz",
            941 => "Nexus Siege",
            940 => "Nexus Siege",
            3000 => "TFT Custom",
            852 => "Bots Medium 1v1",
            851 => "Bots Medium 3v3",
            850 => "Intermediate",
            800 => "Intermediate",
            801 => "Co-op vs. AI",
            860 => "ARAM 5v5 Bots",
            810 => "Intro",
            1404 => "4v4",
            1403 => "3v3",
            1402 => "2v2",
            1401 => "1v1",
            721 => "Clash",
            1400 => "Ultimate Spellbook",
            720 => "Clash",
            3010 => "TFT Hyper Roll Custom",
            600 => "Blood Moon",
            601 => "Blood Moon",
            6060 => "Set Queue 3",
            6002 => "2v0 (Set 3.5 Revival: Galaxies)",
            611 => "Dark Star: Singularity",
            6000 => "Teamfight Tactics (Set 3.5 Revival: Galaxies)",
            610 => "Dark Star: Singularity",
            6001 => "1v0 (Set 3.5 Revival: Galaxies)",
            6070 => "Set Queue 1",
            6005 => "1v7 Bots (Set 3.5 Revival: Galaxies)",
            6010 => "Set Queue 1",
            _ => "unknown",
        };

        f.write_str(name)
    }
}
