import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Button,
  Card,
  Chip,
  EmptyState,
  ErrorState,
  LoadingSpinner,
  ScreenHeader,
  TextInput,
} from '../../components/ui';
import { colors, spacing, typography } from '../../theme';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sectionStyles.wrap}>
      <View style={sectionStyles.header}>
        <View style={sectionStyles.line} />
        <Text style={sectionStyles.title}>{title}</Text>
        <View style={sectionStyles.line} />
      </View>
      <View style={sectionStyles.content}>{children}</View>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  wrap: { gap: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  line: { flex: 1, height: 1, backgroundColor: colors.divider },
  title: { ...typography.label, fontSize: 10, letterSpacing: 2, color: colors.textSecondary },
  content: { gap: spacing.sm },
});

export default function ComponentsShowcase() {
  const [chipLoser, setChipLoser] = useState(false);
  const [chipFinder, setChipFinder] = useState(true);
  const [inputVal, setInputVal] = useState('');

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Vienna Lost & Found — UI" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Buttons — Loser */}
        <Section title="Buttons — Loser Flow">
          <Button label="Verlust melden" onPress={() => {}} color={colors.loserPrimary} />
          <Button label="Abbrechen" onPress={() => {}} variant="secondary" color={colors.loserPrimary} />
          <Button label="Überspringen" onPress={() => {}} variant="ghost" color={colors.loserPrimary} />
          <Button label="Laden..." onPress={() => {}} loading color={colors.loserPrimary} />
          <Button label="Gesperrt" onPress={() => {}} disabled />
        </Section>

        {/* Buttons — Finder */}
        <Section title="Buttons — Finder Flow">
          <Button label="Fund melden" onPress={() => {}} color={colors.finderPrimary} />
          <Button label="Zurück" onPress={() => {}} variant="secondary" color={colors.finderPrimary} />
        </Section>

        {/* Chips */}
        <Section title="Chips — Kategorien">
          <View style={styles.chips}>
            <Chip label="Rucksack" selected={chipLoser} onPress={() => setChipLoser(v => !v)} color={colors.loserPrimary} />
            <Chip label="Schlüssel" color={colors.loserPrimary} />
            <Chip label="Handy" selected color={colors.loserPrimary} />
            <Chip label="Fund" selected={chipFinder} onPress={() => setChipFinder(v => !v)} color={colors.finderPrimary} />
            <Chip label="Dokumente" color={colors.finderPrimary} />
          </View>
        </Section>

        {/* Input */}
        <Section title="Text Input">
          <TextInput
            label="E-Mail"
            placeholder="name@example.com"
            value={inputVal}
            onChangeText={setInputVal}
            keyboardType="email-address"
            accentColor={colors.loserPrimary}
          />
          <TextInput
            label="Name"
            placeholder="Max Mustermann"
            accentColor={colors.finderPrimary}
          />
          <TextInput
            label="Mit Fehler"
            placeholder="Adresse eingeben"
            error="Ungültige E-Mail-Adresse."
          />
        </Section>

        {/* Cards */}
        <Section title="Cards">
          <Card>
            <Text style={typography.h3}>Einfache Card</Text>
            <Text style={[typography.body, { color: colors.textSecondary, marginTop: 4 }]}>
              Keine Akzentfarbe, nur Border.
            </Text>
          </Card>
          <Card accent="loser">
            <Text style={typography.h3}>Loser — Verlust</Text>
            <Text style={[typography.body, { color: colors.textSecondary, marginTop: 4 }]}>
              Blauer Akzentstreifen links.
            </Text>
          </Card>
          <Card accent="finder">
            <Text style={typography.h3}>Finder — Fund</Text>
            <Text style={[typography.body, { color: colors.textSecondary, marginTop: 4 }]}>
              Türkiser Akzentstreifen links.
            </Text>
          </Card>
        </Section>

        {/* States */}
        <Section title="Loading State">
          <View style={[styles.stateBox, styles.stateBoxRow]}>
            <View style={styles.stateHalf}>
              <Text style={styles.stateLabel}>LOSER</Text>
              <LoadingSpinner color={colors.loserPrimary} />
            </View>
            <View style={[styles.stateHalf, styles.stateHalfRight]}>
              <Text style={styles.stateLabel}>FINDER</Text>
              <LoadingSpinner color={colors.finderPrimary} />
            </View>
          </View>
        </Section>

        <Section title="Error State">
          <View style={styles.stateTall}>
            <ErrorState message="Verbindung fehlgeschlagen." onRetry={() => {}} />
          </View>
        </Section>

        <Section title="Empty State">
          <View style={styles.stateTall}>
            <EmptyState
              message="Keine Einträge."
              hint="Melde einen Fund, um zu beginnen."
            />
          </View>
        </Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.screenMargin,
    gap: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 64,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  stateBox: {
    height: 120,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 6,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  stateBoxRow: {
    flexDirection: 'row',
    height: 120,
  },
  stateHalf: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  stateHalfRight: {
    borderLeftWidth: 1,
    borderLeftColor: colors.divider,
  },
  stateLabel: {
    ...typography.label,
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.textSecondary,
  },
  stateTall: {
    height: 240,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 6,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
});
