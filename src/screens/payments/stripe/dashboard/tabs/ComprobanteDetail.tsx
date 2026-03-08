import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Comprobante } from './FacturasTab';

type Status = 'completado' | 'pendiente' | 'borrador';

const STATUS_META: Record<Status, { label: string; color: string; bg: string; dot: string }> = {
  completado: { label: 'Completado', color: '#16a34a', bg: 'rgba(22,163,74,0.1)',   dot: '#16a34a' },
  pendiente:  { label: 'Pendiente',  color: '#d97706', bg: 'rgba(217,119,6,0.1)',   dot: '#f59e0b' },
  borrador:   { label: 'Borrador',   color: '#6b7280', bg: 'rgba(107,114,128,0.1)', dot: '#9ca3af' },
};

const fmtMoney = (n: number) =>
  `$${n.toLocaleString('es-CO', { minimumFractionDigits: 0 })}`;

const buildHTML = (item: Comprobante): string => {
  const m        = STATUS_META[item.status];
  const subtotal = item.amount;
  const tax      = subtotal * (item.taxRate / 100);
  const total    = subtotal + tax;
  const numPad   = String(item.num).padStart(4, '0');

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Helvetica Neue',Arial,sans-serif;background:#f0edff;padding:24px}
  .doc{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(30,27,75,.12);max-width:600px;margin:0 auto}
  .lh{background:linear-gradient(135deg,#4c1d95,#1e40af);padding:20px;position:relative}
  .lh-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px}
  .logo-row{display:flex;align-items:center;margin-bottom:4px}
  .logo-busca{font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px}
  .logo-art{font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;background:rgba(255,255,255,.2);padding:1px 6px;border-radius:5px;margin-left:2px;display:inline-block}
  .lh-tagline{font-size:10px;color:rgba(255,255,255,.5)}
  .lh-num-wrap{text-align:right}
  .lh-num-label{font-size:9px;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:1px}
  .lh-num{font-size:26px;font-weight:800;color:#fff;letter-spacing:-0.5px}
  .lh-bottom{display:flex;justify-content:space-between;align-items:center}
  .lh-date{font-size:11px;color:rgba(255,255,255,.55)}
  .badge{display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.15);border-radius:20px;padding:4px 10px}
  .badge-dot{display:inline-block;width:6px;height:6px;border-radius:3px;background:${m.dot}}
  .badge-text{font-size:11px;font-weight:700;color:#fff}
  .legal{display:flex;gap:8px;align-items:flex-start;background:#eff6ff;padding:10px 14px;border-bottom:1px solid #dbeafe}
  .legal-text{font-size:10.5px;color:#1d4ed8;line-height:1.5;flex:1}
  .bold{font-weight:700}
  .parties{display:flex;border-bottom:1px solid rgba(167,139,250,.12)}
  .party{flex:1;padding:14px 16px}
  .party-r{border-right:1px solid rgba(167,139,250,.12)}
  .party-label{font-size:9px;font-weight:700;color:rgba(124,58,237,.4);text-transform:uppercase;letter-spacing:.8px;margin-bottom:5px}
  .party-name{font-size:13px;font-weight:800;color:#1e1b4b;margin-bottom:2px}
  .party-meta{font-size:10.5px;color:rgba(109,40,217,.5);line-height:1.5}
  .rule{height:1px;background:rgba(167,139,250,.12);margin:0 16px}
  .table{padding:12px 16px}
  .t-head{display:flex;background:rgba(124,58,237,.04);border-radius:8px;padding:7px 10px;margin-bottom:6px}
  .th{font-size:10px;font-weight:700;color:rgba(124,58,237,.45);text-transform:uppercase;letter-spacing:.4px}
  .th-d{flex:5}.th-q{flex:2;text-align:right}.th-v{flex:3;text-align:right}
  .t-row{display:flex;padding:8px 10px}
  .td{font-size:12.5px;color:#1e1b4b}
  .td-d{flex:5}.td-q{flex:2;text-align:right}.td-v{flex:3;text-align:right;font-weight:600}
  .totals{padding:8px 16px}
  .t-row2{display:flex;justify-content:space-between;padding:5px 0}
  .t-lbl{font-size:12px;color:rgba(109,40,217,.5)}
  .t-val{font-size:12px;color:#94a3b8;font-weight:600}
  .t-grand-lbl{font-size:11px;font-weight:700;color:#4c1d95;text-transform:uppercase;letter-spacing:.4px}
  .t-grand-val{font-size:22px;font-weight:800;color:#1e1b4b;letter-spacing:-0.5px}
  .dashed{display:flex;justify-content:center;gap:3px;padding:10px 16px}
  .dash{width:4px;height:1.5px;background:rgba(167,139,250,.2);border-radius:1px;display:inline-block}
  .doc-footer{display:flex;justify-content:space-between;align-items:center;padding:10px 16px;background:rgba(124,58,237,.025)}
  .doc-footer-txt{font-size:9.5px;color:rgba(124,58,237,.35)}
  .disclaimer{font-size:10px;color:rgba(124,58,237,.35);text-align:center;padding:16px 8px;line-height:1.5}
</style>
</head>
<body>
<div class="doc">
  <div class="lh">
    <div class="lh-top">
      <div>
        <div class="logo-row">
          <span class="logo-busca">Busc</span><span class="logo-art">Art</span>
        </div>
        <div class="lh-tagline">Comprobante de Contrataci&oacute;n</div>
      </div>
      <div class="lh-num-wrap">
        <div class="lh-num-label">N&deg;</div>
        <div class="lh-num">${numPad}</div>
      </div>
    </div>
    <div class="lh-bottom">
      <span class="lh-date">${item.date}</span>
      <span class="badge"><span class="badge-dot"></span><span class="badge-text">${m.label}</span></span>
    </div>
  </div>

  <div class="legal">
    <span class="legal-text">Este documento <span class="bold">no reemplaza una factura electr&oacute;nica</span>. Es soporte del acuerdo entre las partes.</span>
  </div>

  <div class="parties">
    <div class="party party-r">
      <div class="party-label">PRESTADOR</div>
      <div class="party-name">${item.emitter}</div>
      <div class="party-meta">CC ${item.emitterNit}</div>
      <div class="party-meta">${item.emitterType}</div>
    </div>
    <div class="party">
      <div class="party-label">CONTRATANTE</div>
      <div class="party-name">${item.client}</div>
      <div class="party-meta">NIT ${item.clientNit}</div>
      ${item.clientEmail ? `<div class="party-meta">${item.clientEmail}</div>` : ''}
      <div class="party-meta">${item.clientCity}</div>
    </div>
  </div>

  <div class="rule"></div>

  <div class="table">
    <div class="t-head">
      <span class="th th-d">Descripci&oacute;n</span>
      <span class="th th-q">Cant.</span>
      <span class="th th-v">Valor</span>
    </div>
    <div class="t-row">
      <span class="td td-d">${item.description}</span>
      <span class="td td-q">1</span>
      <span class="td td-v">${fmtMoney(subtotal)}</span>
    </div>
  </div>

  <div class="rule"></div>

  <div class="totals">
    <div class="t-row2"><span class="t-lbl">Subtotal</span><span class="t-val">${fmtMoney(subtotal)}</span></div>
    ${item.taxRate > 0 ? `<div class="t-row2"><span class="t-lbl">IVA (${item.taxRate}%)</span><span class="t-val">${fmtMoney(tax)}</span></div>` : ''}
    <div class="rule" style="margin:6px 0"></div>
    <div class="t-row2">
      <span class="t-grand-lbl">TOTAL &middot; ${item.currency}</span>
      <span class="t-grand-val">${fmtMoney(total)}</span>
    </div>
  </div>

  <div class="dashed">${Array.from({ length: 32 }).map(() => '<span class="dash"></span>').join('')}</div>

  <div class="doc-footer">
    <span class="doc-footer-txt">Generado por BuscArt &middot; ${item.date}</span>
    <span class="doc-footer-txt">#${numPad}</span>
  </div>
</div>
<p class="disclaimer">BuscArt facilita la generaci&oacute;n de este comprobante. El prestador es responsable de su env&iacute;o y validez fiscal.</p>
</body>
</html>`;
};

interface Props { item: Comprobante | null; onClose: () => void; }

const ComprobanteDetail: React.FC<Props> = ({ item, onClose }) => {
  if (!item) return null;

  const m        = STATUS_META[item.status];
  const subtotal = item.amount;
  const tax      = subtotal * (item.taxRate / 100);
  const total    = subtotal + tax;

  const onShare = async () => {
    try {
      await Share.share({
        message:
          `BuscArt — Comprobante N°${String(item.num).padStart(4, '0')}\n` +
          `${item.date}\n\n` +
          `Prestador: ${item.emitter}\n` +
          `Cliente: ${item.client}\n` +
          `Servicio: ${item.description}\n` +
          `Total: ${fmtMoney(total)} ${item.currency}`,
      });
    } catch {
      // usuario canceló
    }
  };

  const onDownloadPDF = async () => {
    try {
      const html = buildHTML(item);
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Comprobante N°${String(item.num).padStart(4, '0')}`,
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('No disponible', 'Tu dispositivo no soporta compartir archivos.');
      }
    } catch {
      Alert.alert('Error', 'No se pudo generar el PDF. Intenta nuevamente.');
    }
  };

  return (
    <View style={s.overlay}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>

        <View style={s.navBar}>
          <TouchableOpacity onPress={onClose} style={s.navBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color="#1e1b4b" />
          </TouchableOpacity>
          <Text style={s.navTitle}>Comprobante</Text>
          <TouchableOpacity onPress={onShare} style={s.navBtn} activeOpacity={0.8}>
            <Ionicons name="share-outline" size={20} color="#7c3aed" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

          <View style={s.document}>

            <LinearGradient
              colors={['#4c1d95', '#1e40af']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={s.letterhead}
            >
              <View style={s.lhCircle1} />
              <View style={s.lhCircle2} />
              <View style={s.lhTop}>
                <View>
                  <View style={s.logoRow}>
                    <Text style={s.logoBusca}>Busc</Text>
                    <View style={s.logoArtBg}><Text style={s.logoArt}>Art</Text></View>
                  </View>
                  <Text style={s.lhTagline}>Comprobante de Contratación</Text>
                </View>
                <View style={s.lhNumWrap}>
                  <Text style={s.lhNumLabel}>N°</Text>
                  <Text style={s.lhNum}>{String(item.num).padStart(4, '0')}</Text>
                </View>
              </View>
              <View style={s.lhBottom}>
                <View style={s.lhDateRow}>
                  <Ionicons name="calendar-outline" size={11} color="rgba(255,255,255,0.5)" />
                  <Text style={s.lhDate}>{item.date}</Text>
                </View>
                <View style={[s.statusBadge, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                  <View style={[s.statusDot, { backgroundColor: m.dot }]} />
                  <Text style={[s.statusText, { color: '#fff' }]}>{m.label}</Text>
                </View>
              </View>
            </LinearGradient>

            <View style={s.legalBanner}>
              <Ionicons name="information-circle-outline" size={13} color="#1d4ed8" />
              <Text style={s.legalText}>
                Este documento <Text style={s.bold}>no reemplaza una factura electrónica</Text>. Es soporte del acuerdo entre las partes.
              </Text>
            </View>

            <View style={s.partiesRow}>
              <View style={[s.party, s.partyBorder]}>
                <Text style={s.partyLabel}>PRESTADOR</Text>
                <Text style={s.partyName}>{item.emitter}</Text>
                <Text style={s.partyMeta}>CC {item.emitterNit}</Text>
                <Text style={s.partyMeta}>{item.emitterType}</Text>
              </View>
              <View style={s.party}>
                <Text style={s.partyLabel}>CONTRATANTE</Text>
                <Text style={s.partyName}>{item.client}</Text>
                <Text style={s.partyMeta}>NIT {item.clientNit}</Text>
                {item.clientEmail ? <Text style={s.partyMeta}>{item.clientEmail}</Text> : null}
                <Text style={s.partyMeta}>{item.clientCity}</Text>
              </View>
            </View>

            <View style={s.rule} />

            <View style={s.table}>
              <View style={s.tableHead}>
                <Text style={[s.thCell, { flex: 5 }]}>Descripción</Text>
                <Text style={[s.thCell, s.thRight, { flex: 2 }]}>Cant.</Text>
                <Text style={[s.thCell, s.thRight, { flex: 3 }]}>Valor</Text>
              </View>
              <View style={s.tableRow}>
                <Text style={[s.tdCell, { flex: 5 }]}>{item.description}</Text>
                <Text style={[s.tdCell, s.tdRight, { flex: 2 }]}>1</Text>
                <Text style={[s.tdCell, s.tdRight, { flex: 3 }]}>{fmtMoney(subtotal)}</Text>
              </View>
            </View>

            <View style={s.rule} />

            <View style={s.totals}>
              <View style={s.totalRow}>
                <Text style={s.totalLabel}>Subtotal</Text>
                <Text style={s.totalValue}>{fmtMoney(subtotal)}</Text>
              </View>
              {item.taxRate > 0 && (
                <View style={s.totalRow}>
                  <Text style={s.totalLabel}>IVA ({item.taxRate}%)</Text>
                  <Text style={s.totalValue}>{fmtMoney(tax)}</Text>
                </View>
              )}
              <View style={s.rule} />
              <View style={s.totalRow}>
                <Text style={s.totalGrandLabel}>TOTAL  ·  {item.currency}</Text>
                <Text style={s.totalGrandValue}>{fmtMoney(total)}</Text>
              </View>
            </View>

            <View style={s.dashedRow}>
              {Array.from({ length: 32 }).map((_, i) => <View key={i} style={s.dash} />)}
            </View>

            <View style={s.docFooter}>
              <View style={s.docFooterLeft}>
                <Ionicons name="shield-checkmark-outline" size={12} color="rgba(124,58,237,0.35)" />
                <Text style={s.docFooterText}>Generado por BuscArt · {item.date}</Text>
              </View>
              <Text style={s.docFooterNum}>#{String(item.num).padStart(4, '0')}</Text>
            </View>

          </View>

          <View style={s.actions}>
            <TouchableOpacity onPress={onShare} style={s.btnSecondary} activeOpacity={0.75}>
              <Ionicons name="share-social-outline" size={16} color="#7c3aed" />
              <Text style={s.btnSecondaryText}>Compartir</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDownloadPDF} style={{ flex: 1 }} activeOpacity={0.85}>
              <LinearGradient
                colors={['#7c3aed', '#2563eb']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={s.btnPrimary}
              >
                <Ionicons name="download-outline" size={16} color="#fff" />
                <Text style={s.btnPrimaryText}>Descargar PDF</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <Text style={s.disclaimer}>
            BuscArt facilita la generación de este comprobante. El prestador es responsable de su envío y validez fiscal.
          </Text>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ComprobanteDetail;

const s = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#f0edff', zIndex: 200 },

  navBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 4, paddingBottom: 12,
  },
  navBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  navTitle: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b' },

  scroll: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 32 },

  document: {
    backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden',
    shadowColor: '#1e1b4b', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1, shadowRadius: 24, elevation: 8,
    marginBottom: 16,
  },

  letterhead:  { padding: 16, paddingBottom: 12, overflow: 'hidden' },
  lhCircle1:   { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.05)', top: -50, right: -30 },
  lhCircle2:   { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.04)', bottom: -20, left: 10 },
  lhTop:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  logoRow:     { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  logoBusca:   { fontSize: 20, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#fff', letterSpacing: -0.4 },
  logoArtBg:   { borderRadius: 6, paddingHorizontal: 5, paddingVertical: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginLeft: 1 },
  logoArt:     { fontSize: 20, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#fff', letterSpacing: -0.4 },
  lhTagline:   { fontSize: 10, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(255,255,255,0.5)', letterSpacing: 0.2 },
  lhNumWrap:   { alignItems: 'flex-end' },
  lhNumLabel:  { fontSize: 9, fontFamily: 'PlusJakartaSans_600SemiBold', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 },
  lhNum:       { fontSize: 24, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#fff', letterSpacing: -0.5 },
  lhBottom:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  lhDateRow:   { flexDirection: 'row', alignItems: 'center', gap: 4 },
  lhDate:      { fontSize: 11.5, fontFamily: 'PlusJakartaSans_500Medium', color: 'rgba(255,255,255,0.55)' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  statusDot:   { width: 6, height: 6, borderRadius: 3 },
  statusText:  { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold' },

  legalBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: '#eff6ff', padding: 12,
    borderBottomWidth: 1, borderBottomColor: '#dbeafe',
  },
  legalText: { flex: 1, fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: '#1d4ed8', lineHeight: 16 },
  bold:      { fontFamily: 'PlusJakartaSans_700Bold' },

  partiesRow:  { flexDirection: 'row' },
  party:       { flex: 1, padding: 16, paddingVertical: 14 },
  partyBorder: { borderRightWidth: 1, borderRightColor: 'rgba(167,139,250,0.1)' },
  partyLabel:  { fontSize: 9, fontFamily: 'PlusJakartaSans_700Bold', color: 'rgba(124,58,237,0.4)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 5 },
  partyName:   { fontSize: 13, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#1e1b4b', lineHeight: 18, marginBottom: 2 },
  partyMeta:   { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.45)', lineHeight: 16 },

  rule:        { height: 1, backgroundColor: 'rgba(167,139,250,0.12)', marginHorizontal: 16 },
  dashedRow:   { flexDirection: 'row', justifyContent: 'center', gap: 3, paddingVertical: 10, paddingHorizontal: 16 },
  dash:        { width: 4, height: 1.5, borderRadius: 1, backgroundColor: 'rgba(167,139,250,0.2)' },

  table:        { paddingHorizontal: 16, paddingVertical: 12 },
  tableHead:    { flexDirection: 'row', backgroundColor: 'rgba(124,58,237,0.04)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7, marginBottom: 6 },
  thCell:       { fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold', color: 'rgba(124,58,237,0.45)', textTransform: 'uppercase', letterSpacing: 0.4 },
  thRight:      { textAlign: 'right' },
  tableRow:     { flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 8 },
  tdCell:       { fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium', color: '#1e1b4b', lineHeight: 18 },
  tdRight:      { textAlign: 'right' },

  totals:          { paddingHorizontal: 16, paddingVertical: 4 },
  totalRow:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
  totalLabel:      { fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.5)' },
  totalValue:      { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#94a3b8' },
  totalGrandLabel: { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: '#4c1d95', textTransform: 'uppercase', letterSpacing: 0.4 },
  totalGrandValue: { fontSize: 22, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#1e1b4b', letterSpacing: -0.5 },

  docFooter:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: 'rgba(124,58,237,0.025)' },
  docFooterLeft: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  docFooterText: { fontSize: 10, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(124,58,237,0.35)' },
  docFooterNum:  { fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold', color: 'rgba(124,58,237,0.3)' },

  actions:          { flexDirection: 'row', gap: 10, marginBottom: 14 },
  btnSecondary:     { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1.5, borderColor: 'rgba(124,58,237,0.18)' },
  btnSecondaryText: { fontSize: 13.5, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#7c3aed' },
  btnPrimary:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, borderRadius: 14, paddingVertical: 14, flex: 1 },
  btnPrimaryText:   { fontSize: 13.5, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  disclaimer:       { fontSize: 10.5, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(124,58,237,0.3)', textAlign: 'center', lineHeight: 16, paddingHorizontal: 8 },
});
