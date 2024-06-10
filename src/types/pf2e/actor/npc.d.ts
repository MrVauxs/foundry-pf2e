export {};

declare global {
    type NPCSource = BaseCreatureSource<"npc", NPCSystemSource> & {
        flags: DeepPartial<NPCFlags>;
    };

    type NPCFlags = ActorFlagsPF2e & {
        pf2e: { lootable: boolean };
    };

    interface NPCSystemSource extends CreatureSystemSource {
        traits: NPCTraitsSource;

        /** The six primary ability scores. */
        abilities: Abilities;

        /** Any special attributes for this NPC, such as AC or health. */
        attributes: NPCAttributesSource;

        /** Modifier of the perception statistic */
        perception: NPCPerceptionSource;

        initiative: CreatureInitiativeSource;

        /** Details about this actor, such as alignment or ancestry. */
        details: NPCDetailsSource;

        /** The three saves for NPCs. NPC saves have a 'base' score which is the score before applying custom modifiers. */
        saves: NPCSavesSource;

        /** Spellcasting data: currently only used for rituals */
        spellcasting?: {
            rituals?: {
                dc: number;
            };
        };

        resources: CreatureResourcesSource;
    }

    interface NPCAttributesSource extends Required<ActorAttributesSource> {
        ac: {
            value: number;
            details: string;
        };
        adjustment: "elite" | "weak" | null;
        hp: NPCHitPointsSource;
        speed: {
            value: number;
            otherSpeeds: LabeledSpeed[];
            details: string;
        };
        allSaves: {
            value: string;
        };
    }

    interface NPCHitPointsSource extends Required<CreatureHitPointsSource> {
        details: string;
    }

    interface NPCPerceptionSource {
        details: string;
        mod: number;
        senses: SenseData[];
        vision: boolean;
    }

    interface NPCDetailsSource extends CreatureDetailsSource {
        level: {
            value: number;
        };
        languages: CreatureLanguagesData;
        /** A very brief description */
        blurb: string;
        /** The in-depth description and any other public notes */
        publicNotes: string;
        /** The private GM notes */
        privateNotes: string;
        /** Information concerning the publication from which this actor originates */
        publication: PublicationData;
    }

    type NPCSavesSource = Record<SaveType, { value: number; saveDetail: string }>;

    interface NPCTraitsSource extends Required<CreatureTraitsSource> {}

    /** The raw information contained within the actor data object for NPCs. */
    interface NPCSystemData
        extends Omit<NPCSystemSource, "attributes" | "perception" | "traits">,
            CreatureSystemData {
        /** The six primary ability scores. */
        abilities: Abilities;

        /** The three saves for NPCs. NPC saves have a 'base' score which is the score before applying custom modifiers. */
        saves: NPCSaves;

        /** Details about this actor, such as alignment or ancestry. */
        details: NPCDetails;

        perception: NPCPerceptionData;

        initiative: InitiativeTraceData;

        /** Any special attributes for this NPC, such as AC or health. */
        attributes: NPCAttributes;

        /** Skills that this actor possesses; skills the actor is actually trained on are marked 'visible'. */
        skills: Record<string, NPCSkillData>;

        /** Special strikes which the creature can take. */
        actions: NPCStrike[];

        resources: CreatureResources;

        spellcasting: {
            rituals: { dc: number };
        };

        customModifiers: Record<string, ModifierPF2e[]>;
    }

    interface NPCPerceptionData extends CreaturePerceptionData {
        mod: number;
    }

    interface NPCAttributes
        extends Omit<
                NPCAttributesSource,
                "ac" | "initiative" | "immunities" | "weaknesses" | "resistances"
            >,
            CreatureAttributes {
        adjustment: "elite" | "weak" | null;
        hp: NPCHitPoints;
        speed: NPCSpeeds;
        /**
         * Data related to the currently equipped shield. This is copied from the shield data itself, and exists to
         * allow for the shield health to be shown in a token.
         */
        shield: HeldShieldData;
        /** Textual information about any special benefits that apply to all saves. */
        allSaves: { value: string };
        familiarAbilities: StatisticModifier;

        /** A fake class DC (set to a level-based DC) for use with critical specialization effects that require it */
        classDC: { value: number };
        /** The best spell DC */
        spellDC: { value: number } | null;
        /** And a fake class-or-spell DC to go along with it */
        classOrSpellDC: { value: number };
    }

    interface NPCDetails extends NPCDetailsSource, CreatureDetails {
        level: {
            value: number;
            /** The presence of a `base` that is different from the `value` indicates the level was adjusted. */
            base: number;
        };

        alliance: ActorAlliance;
    }

    /** The full data for a NPC action (used primarily for strikes.) */
    interface NPCStrike extends StrikeData {
        item: MeleePF2e<ActorPF2e>;
        /** The type of attack as a localization string */
        attackRollType?: string;
        /** The id of the item this strike is generated from */
        sourceId?: string;
        /** Additional effects from a successful strike, like "Grab" */
        additionalEffects: { tag: string; label: string }[];
        /** A melee usage of a firearm: not available on NPC strikes */
        altUsages?: never;
    }

    /** Save data with an additional "base" value */
    interface NPCSaveData extends SaveData {
        base?: number;
        saveDetail: string;
    }
    /** Saves with NPCSaveData */
    interface NPCSaves {
        fortitude: NPCSaveData;
        reflex: NPCSaveData;
        will: NPCSaveData;
    }

    interface NPCHitPoints extends HitPointsStatistic {
        base?: number;
    }

    /** Skill data with a "base" value and whether the skill should be rendered (visible) */
    interface NPCSkillData extends AttributeBasedTraceData {
        base: number;
        itemId: string | null;
        lore: boolean;
        mod: number;
        variants: { label: string; options: string }[];
        visible: boolean;
    }

    interface NPCSpeeds extends CreatureSpeeds {
        details: string;
    }

    interface RecallKnowledgeDC {
        dc: number;
        progression: number[];
        start: DCAdjustment;
    }

    interface CreatureIdentificationData {
        skills: SkillSlug[];
        standard: RecallKnowledgeDC;
        lore: [RecallKnowledgeDC, RecallKnowledgeDC];
    }

    class NPCPF2e<
        TParent extends TokenDocumentPF2e | null = TokenDocumentPF2e | null
    > extends CreaturePF2e<TParent> {
        get identificationDCs(): CreatureIdentificationData;

        applyAdjustment(adjustment: "elite" | "weak" | null): Promise<void>;
    }

    interface NPCPF2e<TParent extends TokenDocumentPF2e | null = TokenDocumentPF2e | null>
        extends CreaturePF2e<TParent> {
        flags: NPCFlags;
        readonly _source: NPCSource;
        system: NPCSystemData;
    }
}
