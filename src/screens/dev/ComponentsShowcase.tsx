import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Button,
  Card,
  Chip,
  EmptyState,
  ErrorState,
  GeoBar,
  GeoCircle,
  GeoDotRow,
  GeoSemicircle,
  GeoSquare,
  LoadingSpinner,
  ScreenHeader,
  TextInput,
} from '../../components/ui';
import { colors, spacing, typography } from '../../theme';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sectionStyles.wrap}>
      <View style={sectionStyles.header}>
        <View style={sectionStyles.bar} />
        <Text style={sectionStyles.title}>{title}</Text>
      </View>
      <View style={sectionStyles.content}>{children}</View>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  wrap: { gap: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  bar: { width: 24, height: 6, backgroundColor: colors.textPrimary },
  title: { ...typography.label, color: colors.textPrimary },
  content: { gap: spacing.sm },
});

export default function ComponentsShowcase() {
  const [chipKey, setChipKey] = useState(true);
  const [chipPhone, setChipPhone] = useState(false);
  const [inputVal, setInputVal] = useState('');

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Bauhaus Wien · UI" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.hero}>
          <Text style={styles.heroH1}>Verloren.{'\n'}Gefunden.</Text>
          <Text style={styles.heroBody}>
            Ein geometrisches Designsystem für Vienna Lost &amp; Found —
            inspiriert von Bauhaus, Pentagram und der Wiener Moderne.
          </Text>
        </View>

        <View style={styles.heroDivider} />

        <Section title="Geometric Language">
          <View style={styles.geoRow}>
            <GeoCircle size={40} color={colors.loserPrimary} />
            <GeoSquare size={40} color={colors.finderPrimary} />
            <GeoCircle size={40} color={colors.accent} />
            <GeoSquare size={40} color={colors.sage} />
          </View>
          <View style={styles.geoRow}>
            <GeoSemicircle size={50} color={colors.loserPrimary} side="right" />
            <GeoSemicircle size={50} color={colors.finderPrimary} side="left" />
            <GeoSemicircle size={50} color={colors.accent} side="top" />
            <GeoSemicircle size={50} color={colors.sage} side="bottom" />
          </View>
          <View style={styles.geoRow}>
            <GeoBar width={80} height={6} color={colors.loserPrimary} />
            <GeoBar width={40} height={6} color={colors.finderPrimary} />
            <GeoBar width={20} height={6} color={colors.accent} />
            <GeoBar width={6} height={6} color={colors.sage} />
          </View>
          <View style={{ marginTop: spacing.xs }}>
            <GeoDotRow size={12} gap={8} />
          </View>
        </Section>

        <Section title="Buttons — Loser">
          <Button label="Verlust melden" onPress={() => {}} />
          <Button label="Abbrechen" onPress={() => {}} variant="secondary" />
          <Button label="Überspringen" onPress={() => {}} variant="ghost" withArrow={false} />
          <Button label="Lade" onPress={() => {}} loading />
          <Button label="Gesperrt" onPress={() => {}} disabled />
        </Section>

        <Section title="Buttons — Finder">
          <Button label="Fund melden" onPress={() => {}} color={colors.finderPrimary} />
          <Button label="Zurück" onPress={() => {}} variant="secondary" color={colors.finderPrimary} />
        </Section>

        <Section title="Action Card — Loser (Composition)">
          <Card bordered>
            <View style={styles.actionRow}>
              <View style={styles.actionLeftWrap}>
                <GeoSemicircle size={160} color={colors.loserPrimary} side="right" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionKickerLoser}>VERLUST</Text>
                <Text style={styles.actionTitle}>Etwas{'\n'}verloren</Text>
                <GeoBar width={32} height={4} color={colors.finderPrimary} />
                <Text style={styles.actionBody}>
                  Beschreiben Sie, was fehlt. Wir benachrichtigen Sie bei einem Fund.
                </Text>
              </View>
            </View>
            <View style={{ marginTop: spacing.md }}>
              <Button label="Melden" onPress={() => {}} />
            </View>
          </Card>
        </Section>

        <Section title="Action Card — Finder (Composition)">
          <Card bordered>
            <View style={styles.actionRow}>
              <View style={styles.actionLeftSquare}>
                <GeoSquare size={80} color={colors.finderPrimary} />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionKickerFinder}>FUND</Text>
                <Text style={styles.actionTitle}>Etwas{'\n'}gefunden</Text>
                <GeoBar width={32} height={4} color={colors.loserPrimary} />
                <Text style={styles.actionBody}>
                  Foto, Standort — in dreißig Sekunden helfen Sie jemandem.
                </Text>
              </View>
            </View>
            <View style={{ marginTop: spacing.md }}>
              <Button label="Melden" onPress={() => {}} color={colors.finderPrimary} />
            </View>
          </Card>
        </Section>

        <Section title="Counter Composition">
          <Card>
            <View style={styles.counterRow}>
              <View style={styles.counterCircle}>
                <Text style={styles.counterNum}>247</Text>
              </View>
              <View style={styles.counterText}>
                <Text style={styles.counterLabel}>offene{'\n'}Meldungen</Text>
                <GeoDotRow size={10} gap={6} />
              </View>
            </View>
          </Card>
        </Section>

        <Section title="Chips — Categories">
          <View style={styles.chipsRow}>
            <Chip label="Schlüssel" selected={chipKey} onPress={() => setChipKey(v => !v)} />
            <Chip label="Geldbörse" shape="square" color={colors.finderPrimary} />
            <Chip label="Handy" selected={chipPhone} onPress={() => setChipPhone(v => !v)} color={colors.accent} />
            <Chip label="Brille" shape="square" color={colors.sage} />
          </View>
        </Section>

        <Section title="Text Input">
          <TextInput
            label="E-Mail"
            placeholder="name@example.com"
            value={inputVal}
            onChangeText={setInputVal}
            keyboardType="email-address"
          />
          <TextInput label="Name" placeholder="Max Mustermann" accentColor={colors.finderPrimary} />
          <TextInput label="Mit Fehler" placeholder="Adresse" error="Ungültige Eingabe." />
        </Section>

        <Section title="States">
          <View style={[styles.stateBox, styles.stateRow]}>
            <View style={styles.stateHalf}>
              <Text style={styles.stateLabel}>LOSER</Text>
              <LoadingSpinner color={colors.loserPrimary} />
            </View>
            <View style={[styles.stateHalf, styles.stateHalfRight]}>
              <Text style={styles.stateLabel}>FINDER</Text>
              <LoadingSpinner color={colors.finderPrimary} />
            </View>
          </View>
          <View style={styles.stateTall}>
            <ErrorState message="Verbindung fehlgeschlagen." onRetry={() => {}} />
          </View>
          <View style={styles.stateTall}>
            <EmptyState message="Keine Einträge." hint="Melde einen Fund, um zu beginnen." />
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

  hero: { gap: spacing.md },
  heroH1: { ...typography.h1, color: colors.textPrimary },
  heroBody: { ...typography.body, color: colors.textSecondary },
  heroDivider: { height: 4, backgroundColor: colors.textPrimary, marginTop: -spacing.sm },

  geoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },

  actionRow: { flexDirection: 'row', alignItems: 'stretch', overflow: 'hidden', minHeight: 140 },
  actionLeftWrap: {
    width: 80,
    overflow: 'hidden',
    marginLeft: -spacing.md,
    marginVertical: -spacing.md,
    justifyContent: 'center',
  },
  actionLeftSquare: {
    width: 80,
    marginLeft: -spacing.md,
    marginVertical: -spacing.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContent: { flex: 1, paddingLeft: spacing.md, gap: spacing.xs },
  actionKickerLoser: { ...typography.label, color: colors.loserPrimary },
  actionKickerFinder: { ...typography.label, color: colors.finderPressed },
  actionTitle: { ...typography.h2, color: colors.textPrimary },
  actionBody: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.xs,
  },

  counterRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  counterCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.sageSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterNum: {
    fontFamily: typography.h1.fontFamily,
    fontSize: 46,
    letterSpacing: -2,
    color: colors.accent,
  },
  counterText: { flex: 1, gap: spacing.sm },
  counterLabel: { ...typography.h3, color: colors.textPrimary, fontSize: 16 },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },

  stateBox: {
    height: 120,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  stateRow: { flexDirection: 'row' },
  stateHalf: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  stateHalfRight: { borderLeftWidth: 1.5, borderLeftColor: colors.border },
  stateLabel: { ...typography.label, fontSize: 9, color: colors.textSecondary },
  stateTall: {
    height: 240,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
});
