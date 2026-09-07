// ============================================
// R6S 武器配件数据库 - 数据层
// 版本基准: Y11S3 "Operation Split Fire" (2026-09-01 上线) — 主表已落地
// 瞄具体系已按 Y9S1 "Deadly Omen" 重构: 1.0x / 2.5x / 3.5x 三大类
// 分类体系: 主武器7类 + 副武器4类
// ============================================

// ================================================================
// 配件槽位分类（按游戏内军械库的分类与顺序）
//   sight 瞄准镜 / barrel 枪管 / grip 握把 / underbarrel 下挂
// ================================================================
const ATTACHMENT_SLOTS = [
    { key: 'sight',       name: '瞄准镜', nameEn: 'Sight',       icon: '🔭',
      desc: 'Y9S1 重构后按倍率分 1.0x / 2.5x / 3.5x 三档，每款型号单独列出。' },
    { key: 'barrel',      name: '枪管',   nameEn: 'Barrel',      icon: '🔧',
      desc: '主要调节后坐力形态，Y7S3 后消音器不再降低伤害。' },
    { key: 'grip',        name: '握把',   nameEn: 'Grip',        icon: '✊',
      desc: 'Y9S1 重做：新增水平前握把，垂直前握把下调至 20%，拐角握把改提供装填速度。各武器可装的握把种类由武器决定，请以武器详情页「可用配件」为准。' },
    { key: 'underbarrel', name: '下挂',   nameEn: 'Under Barrel', icon: '🔴',
      desc: 'Y9S1 重做：激光不再改善腰射，改为 +10% ADS 速度。' }
];

const ATTACHMENT_DATA = {
    barrels: {
        muzzle_brake: {
            name: '枪口制退器', nameEn: 'Muzzle Brake', slot: 'barrel', icon: '🔧',
            image: 'images/attachments/icons/muzzle_brake.png',
            effects: [
                { type: 'positive', label: '首发后坐力减少', value: '-45%' },
                { type: 'positive', label: '回正时间减少', value: '-45%' },
                { type: 'neutral', label: '水平后坐力', value: '不变' },
                { type: 'neutral', label: '伤害', value: '不变' }
            ],
            description: '核心作用是压制第一发子弹的上跳幅度。半自动武器（DMR/手枪）每发都是"首发"，效果最大化。',
            bestFor: '半自动武器、DMR、点射打法'
        },
        compensator: {
            name: '补偿器', nameEn: 'Compensator', slot: 'barrel', icon: '⚙️',
            image: 'images/attachments/icons/compensator.png',
            effects: [
                { type: 'positive', label: '水平后坐力减少', value: '-35%' },
                { type: 'neutral', label: '垂直/首发后坐力', value: '不变' },
                { type: 'neutral', label: '伤害', value: '不变' }
            ],
            description: '水平后坐力是左右随机晃动，玩家几乎无法手动补偿。补偿器直接减少这种随机性，使弹道更集中在垂直线上。',
            bestFor: '全自动高射速武器、长扫射'
        },
        flash_hider: {
            name: '消焰器', nameEn: 'Flash Hider', slot: 'barrel', icon: '🔥',
            image: 'images/attachments/icons/flash_hider.png',
            effects: [
                { type: 'positive', label: '每发垂直后坐力减少', value: '-15%' },
                { type: 'positive', label: '首发垂直后坐力额外减少', value: '-13%' },
                { type: 'positive', label: '枪口火焰', value: '完全隐藏' },
                { type: 'neutral', label: '伤害', value: '不变' }
            ],
            description: '制退器和补偿器的折中方案，提供全面但不极端的后坐力改善，同时隐藏枪口火焰。',
            bestFor: '万金油选择、中射速自动武器'
        },
        suppressor: {
            name: '消音器', nameEn: 'Suppressor', slot: 'barrel', icon: '🤫',
            image: 'images/attachments/icons/suppressor.png',
            effects: [
                { type: 'positive', label: '射击方向标记', value: '完全消除' },
                { type: 'positive', label: '射击声音距离', value: '大幅降低' },
                { type: 'positive', label: '枪口火焰', value: '完全隐藏' },
                { type: 'info', label: '伤害惩罚', value: '无 (Y7S3后)' },
                { type: 'negative', label: '后坐力减少', value: '无' }
            ],
            description: 'Y7S3后消音器不再降低伤害！核心价值是信息战——敌人被命中时不会看到射击来源方向标记。代价是放弃后坐力控制。',
            bestFor: '游走/侧翼干员、隐蔽打法'
        },
        extended_barrel: {
            name: '延伸枪管', nameEn: 'Extended Barrel', slot: 'barrel', icon: '📏',
            image: 'images/attachments/icons/extended_barrel.png',
            effects: [
                { type: 'positive', label: '伤害衰减幅度减少', value: '-15~20%' },
                { type: 'neutral', label: '衰减起始距离', value: '不变' },
                { type: 'negative', label: '后坐力减少', value: '无' }
            ],
            description: '数据挖掘确认，延伸枪管不会推迟伤害衰减开始距离，实际效果是减少衰减幅度。在中远距离交战中有效保留更多伤害。',
            bestFor: '后坐力可控的中远距离武器'
        }
    },
    grips: {
        vertical_grip: {
            name: '垂直前握把', nameEn: 'Vertical Grip', slot: 'grip', icon: '✊',
            image: 'images/attachments/icons/vertical_grip.png',
            changedIn: 'Y9S1',
            effects: [
                { type: 'positive', label: '后坐力控制', value: '20%（Y9S1 前为 25%）' },
                { type: 'neutral', label: 'ADS 速度', value: '不变' }
            ],
            description: '直接减少射击时枪口上跳幅度，效果可叠加在枪管配件之上。⚠️ Y9S1 将加成由 25% 下调至 20%，这是官方首次给出明确数值。',
            bestFor: '后坐力大的武器、新手玩家'
        },
        angled_grip: {
            name: '拐角握把', nameEn: 'Angled Grip', slot: 'grip', icon: '📐',
            image: 'images/attachments/icons/angled_grip.png',
            changedIn: 'Y9S1',
            effects: [
                { type: 'positive', label: '装填速度', value: '+20%' },
                { type: 'negative', label: 'ADS 速度加成', value: '已移除（Y9S1 前为 -32%）' },
                { type: 'neutral', label: '后坐力', value: '不变' }
            ],
            description: '⚠️ Y9S1 重做：不再提供 ADS 速度加成，改为 +20% 装填速度。原「-32% ADS 时间」的描述已过期，适用于更看重补弹节奏而非开镜速度的打法。',
            bestFor: '弹匣消耗快、频繁补弹的武器'
        },
        horizontal_grip: {
            name: '水平前握把', nameEn: 'Horizontal Grip', slot: 'grip', icon: '🤲',
            image: 'images/attachments/icons/horizontal_grip.png',
            newIn: 'Y9S1',
            effects: [
                { type: 'positive', label: '干员移动速度', value: '提升' },
                { type: 'negative', label: '后坐力控制', value: '下降' },
                { type: 'neutral', label: 'ADS 速度', value: '不变' }
            ],
            description: '🆕 Y9S1 新增握把。提升干员移动速度，代价是后坐力控制下降。官方未公布具体百分比，故此处仅标注方向。适合需要频繁转点、游走的打法。',
            bestFor: '需要高机动性的转点/游走打法'
        }
    },
    underbarrel: {
        laser_sight: {
            name: '激光瞄准器', nameEn: 'Laser Sight', slot: 'underbarrel', icon: '🔴',
            image: 'images/attachments/icons/laser_sight.png',
            changedIn: 'Y9S1',
            effects: [
                { type: 'positive', label: 'ADS 速度', value: '+10%' },
                { type: 'negative', label: '副作用', value: '发射可见红色激光点' },
                { type: 'neutral', label: '腰射精度', value: '不再提升（Y9S1 前为 ~25%）' }
            ],
            description: '⚠️ Y9S1 重做：不再改善腰射精度，改为 +10% ADS 速度。红色激光点依然会暴露位置和瞄准方向，但远距离几乎看不到。',
            bestFor: '需要更快开镜的打法；霰弹枪仍常见'
        }
    },
    // ================================================================
    // 瞄具体系（Y9S1 "Deadly Omen" 重构后）
    //   大类 = 放大倍率 (1.0x / 2.5x / 3.5x)
    //   小类 = 瞄具类型 (机瞄 / 红点 / 全息 / 反射 / 放大镜 / 望远镜)
    //   variants = 军械库内可选的具体型号，配游戏内原生 ICON
    // Y9S1 移除 1.5x / 2.0x / 3.0x；2.0x 与 3.0x 统一升级为 3.5x 望远镜
    // ================================================================
    sights: {
        // ---------- 大类 1：1.0x 无放大 ----------
        iron: {
            name: '机瞄', nameEn: 'Iron Sight', slot: 'sight', icon: '▫️',
            mag: '1.0x', magGroup: '1.0x', family: '机瞄', noSlot: true,
            variants: [],
            effects: [
                { type: 'info', label: '放大倍率', value: '1.0x' },
                { type: 'positive', label: 'ADS 速度', value: '+10%（全瞄具最快）' },
                { type: 'positive', label: '视野', value: '完全无遮挡' }
            ],
            description: '不装任何瞄具时的默认状态，不占配件槽。Y9S1 起获得 +10% ADS 速度加成，是所有选项里出镜最快的。',
            bestFor: '极近距离、追求最快开镜的打法'
        },
        red_dot: {
            name: '红点瞄准镜', nameEn: 'Red Dot Sight', slot: 'sight', icon: '🔴',
            mag: '1.0x', magGroup: '1.0x', family: '非放大',
            variants: [
                { key: 'red_dot_a', name: '红点瞄准器 A', nameEn: 'Red Dot A', icon: 'images/sights/icons/red_dot_a.png', desc: '方形外壳 + 圆点准星，最常见外观' },
                { key: 'red_dot_b', name: '红点瞄准器 B', nameEn: 'Red Dot B', icon: 'images/sights/icons/red_dot_b.png', desc: '宽镜体 + T 字准星，俄系风格' },
                { key: 'red_dot_c', name: '红点瞄准器 C', nameEn: 'Red Dot C', icon: 'images/sights/icons/red_dot_c.png', desc: '抬高型，右下带调节旋钮（Y5S3 引入）' }
            ],
            effects: [
                { type: 'info', label: '放大倍率', value: '1.0x' },
                { type: 'positive', label: 'ADS 速度', value: '+5%' },
                { type: 'positive', label: '视野', value: '最大' }
            ],
            description: '无放大倍率的反射式瞄具，视野最大，适合近距离快速交战。Y9S1 起非放大瞄具统一获得 +5% ADS 速度。',
            bestFor: '近距离CQB、快速清角'
        },
        holographic: {
            name: '全息瞄准镜', nameEn: 'Holographic Sight', slot: 'sight', icon: '🟢',
            mag: '1.0x', magGroup: '1.0x', family: '非放大',
            variants: [
                { key: 'holo_a', name: '全息瞄准器 A', nameEn: 'Holographic A', icon: 'images/sights/icons/holo_a.png', desc: 'EOTech 风格方框 + 圆环带点准星' },
                { key: 'holo_b', name: '全息瞄准器 B', nameEn: 'Holographic B', icon: 'images/sights/icons/holo_b.png', desc: '机身带 +/− 调节键 + 圆环十字准星' },
                { key: 'holo_c', name: '全息瞄准器 C', nameEn: 'Holographic C', icon: 'images/sights/icons/holo_c.png', desc: '紧凑低矮宽体，准星为横向短划' },
                { key: 'holo_d', name: '全息瞄准器 D', nameEn: 'Holographic D', icon: 'images/sights/icons/holo_d.png', desc: '极简窄框，准星收束极小（Y5S3 引入）' }
            ],
            effects: [
                { type: 'info', label: '放大倍率', value: '1.0x' },
                { type: 'positive', label: 'ADS 速度', value: '+5%' },
                { type: 'positive', label: '准星清晰度', value: '高' }
            ],
            description: '全息投影技术，准星环形设计便于快速对准目标中心，框架稍大但准星辨识度高。',
            bestFor: '中近距离、需要精准瞄点'
        },
        reflex: {
            name: '反射瞄准镜', nameEn: 'Reflex Sight', slot: 'sight', icon: '🔺',
            mag: '1.0x', magGroup: '1.0x', family: '非放大',
            variants: [
                { key: 'reflex_a', name: '反射式瞄准器 A', nameEn: 'Reflex A', icon: 'images/sights/icons/reflex_a.png', desc: '塑料外壳 + 绿色倒三角准星' },
                { key: 'reflex_b', name: '反射式瞄准器 B', nameEn: 'Reflex B', icon: 'images/sights/icons/reflex_b.png', desc: '圆形金属镜体，最厚重，准星带横向标线' },
                { key: 'reflex_c', name: '反射式瞄准器 C', nameEn: 'Reflex C', icon: 'images/sights/icons/reflex_c.png', desc: '复古低矮款，镜身最扁平，右侧带线缆造型' }
            ],
            effects: [
                { type: 'info', label: '放大倍率', value: '1.0x' },
                { type: 'positive', label: 'ADS 速度', value: '+5%' },
                { type: 'positive', label: '框架遮挡', value: '最小' }
            ],
            description: '三角形准星、开放式框架遮挡最少。个人偏好差异大，部分玩家觉得三角准星不如圆点直觉。',
            bestFor: '偏好开放视野的玩家'
        },

        // ---------- 大类 2：2.5x 放大镜 ----------
        magnified: {
            name: '放大瞄准镜', nameEn: 'Magnified Scope', slot: 'sight', icon: '🔭',
            mag: '2.5x', magGroup: '2.5x', family: '放大镜',
            variants: [
                { key: 'scope_2_5x_a', name: '放大瞄准镜 A', nameEn: 'Magnified A', icon: 'images/sights/icons/scope_2_5x_a.png', desc: '宽体镜身四角带螺栓，竖直标线 + 中心点' },
                { key: 'scope_2_5x_b', name: '放大瞄准镜 B', nameEn: 'Magnified B', icon: 'images/sights/icons/scope_2_5x_b.png', desc: '横向较宽的方肩镜体，向上箭头式标线' },
                { key: 'scope_2_5x_c', name: '放大瞄准镜 C', nameEn: 'Magnified C', icon: 'images/sights/icons/scope_2_5x_c.png', desc: '高座紧凑镜体，梯形宽底座，半圆环分划' }
            ],
            effects: [
                { type: 'info', label: '放大倍率', value: '约 2.5x' },
                { type: 'positive', label: '中远距离优势', value: '显著' },
                { type: 'negative', label: '近距离', value: '视野受限' },
                { type: 'info', label: '进攻方', value: '全主武器可用' },
                { type: 'negative', label: '防守方', value: '仅限白名单武器/干员' }
            ],
            description: 'Y9S1 由原 1.5x 升级而来的 ACOG 类倍镜。进攻方所有主武器均可装配；防守方受严格限制，仅少数武器的特定干员可用。',
            bestFor: '中远距离架点、进攻方长距离交战'
        },

        // ---------- 大类 3：3.5x 望远镜 ----------
        telescopic: {
            name: '望远式瞄准镜', nameEn: 'Telescopic Scope', slot: 'sight', icon: '🎯',
            mag: '3.5x', magGroup: '3.5x', family: '望远镜',
            variants: [
                { key: 'scope_3_5x_a', name: '望远式瞄准镜 A', nameEn: 'Telescopic A', icon: 'images/sights/icons/scope_3_5x_a.png', desc: '左上带斜向遮光罩／导轨，细十字 + 中心点' },
                { key: 'scope_3_5x_b', name: '望远式瞄准镜 B', nameEn: 'Telescopic B', icon: 'images/sights/icons/scope_3_5x_b.png', desc: '十字对称镜体更粗壮，准星带红色圆环辅助圈' }
            ],
            effects: [
                { type: 'info', label: '放大倍率', value: '约 3.5x' },
                { type: 'positive', label: '远距离精度', value: '极佳' },
                { type: 'negative', label: '近距离', value: '严重劣势' },
                { type: 'negative', label: '可用范围', value: '仅进攻方 DMR' }
            ],
            description: 'Y9S1 由原 2.0x / 3.0x 合并升级而来，是当前版本最高倍率的通用瞄具。可用范围极窄——只有进攻方的射手步枪（DMR）能装。',
            bestFor: '进攻方 DMR 远距离架点'
        }
    }
};

// ================================================================
// 瞄具大类分组（按放大倍率）— 供 UI 分组渲染
// ================================================================
const SIGHT_GROUPS = [
    {
        key: 'mag_1x', label: '1.0x 无放大', icon: '⚪',
        desc: '不改变视野倍率，共 10 款可选型号；机瞄为不占配件槽的默认状态。Y9S1 起机瞄 +10% ADS 速度，红点/全息/反射 +5%。',
        families: ['iron', 'red_dot', 'holographic', 'reflex']
    },
    {
        key: 'mag_2_5x', label: '2.5x 放大镜', icon: '🔭',
        desc: '进攻方全主武器可用；防守方仅限白名单武器与干员。',
        families: ['magnified']
    },
    {
        key: 'mag_3_5x', label: '3.5x 望远镜', icon: '🎯',
        desc: '当前版本最高倍率通用瞄具，仅进攻方 DMR 可装。',
        families: ['telescopic']
    }
];

// 防守方 2.5x 放大镜白名单（Y9S1 官方分配表）
const DEF_MAGNIFIED_WHITELIST = {
    '9mm C1': ['Frost'], 'P10 RONI': ['Mozzie'], '9x19VSN': ['Tachanka'],
    'ACS12': ['Alibi', 'Maestro', 'Azami'], 'AR-15.50': ['Tubarão'],
    'BOSG.12.2': ['Vigil'], 'Mk 14 EBR': ['Aruni'], 'MP5K': ['Wamai'],
    'MP5': ['Doc', 'Melusi', 'Rook'], 'P90': ['Doc', 'Rook'],
    'TCSG12': ['Goyo', 'Kaid'], 'UMP45': ['Castle'],
    'UZK50GI': ['Thorn'], 'Vector .45': ['Goyo']
};

// ADS时间基准 + 转角握把效果
const ADS_TIMES = {
    ar:  { base: 400, angled: 272, saved: 128, label: '突击步枪' },
    smg: { base: 300, angled: 204, saved: 96, label: '冲锋枪' },
    lmg: { base: 450, angled: 306, saved: 144, label: '轻机枪' },
    dmr: { base: 450, angled: 306, saved: 144, label: '射手步枪' },
    pistol: { base: 200, angled: 136, saved: 64, label: '手枪' }
};

// 瞄准镜 ADS 灵敏度乘数（Y9S1 重构后）
// ⚠️ 1.5x / 2.0x / 3.0x 已于 Y9S1 从游戏移除，故删除
// ⚠️ 3.5x 望远镜与 Y11S3 新版 CSRX 的乘数官方未公布，标 null 而非估算
const SIGHT_MULTIPLIERS = [
    { mag: '1.0x', multiplier: 1.0, note: '机瞄/红点/全息/反射' },
    { mag: '2.5x', multiplier: 0.7, note: '放大镜 Magnified' },
    { mag: '3.5x', multiplier: null, note: '望远镜 Telescopic — 官方未公布' },
    { mag: '3.5x/8.0x', multiplier: null, note: 'CSRX 300 内置镜（Y11S3 起）— 官方未公布；改版前 5x/12x 为 0.4 / 0.17' }
];

// ---- 武器分类体系 ----
// 主武器 (Primary)
// ar       = 突击步枪
// smg      = 冲锋枪
// lmg      = 轻机枪
// sniper   = 狙击步枪
// dmr      = 射手步枪
// shotgun  = 霰弹枪
// slug     = 独头霰弹枪
//
// 副武器 (Secondary)
// shotgun_sec = 霰弹枪（次要）
// pistol      = 手枪
// smg_sec     = 冲锋枪（次要）
// revolver    = 左轮手枪

const TYPE_NAMES = {
    // 主武器
    ar: '突击步枪', smg: '冲锋枪', lmg: '轻机枪',
    sniper: '狙击步枪', dmr: '射手步枪', shotgun: '霰弹枪', slug: '独头霰弹枪',
    // 副武器
    shotgun_sec: '霰弹枪(次要)', pistol: '手枪', smg_sec: '冲锋枪(次要)', revolver: '左轮手枪'
};

const WEAPON_CATEGORY = {
    // 主武器类型
    ar: 'primary', smg: 'primary', lmg: 'primary', sniper: 'primary',
    dmr: 'primary', shotgun: 'primary', slug: 'primary',
    // 副武器类型
    shotgun_sec: 'secondary', pistol: 'secondary', smg_sec: 'secondary', revolver: 'secondary'
};

// ---- 干员图标 ----
// 来源: r6operators npm包 (marcopixel), 通过 jsDelivr CDN 加载
// URL格式: https://cdn.jsdelivr.net/npm/r6operators@2.12.0/dist/icons/{key}.svg
const OPERATOR_ICON_CDN = 'https://cdn.jsdelivr.net/npm/r6operators@2.12.0/dist/icons/';
const OPERATOR_ICON_MAP = {
    'Ace': 'ace', 'Alibi': 'alibi', 'Amaru': 'amaru', 'Aruni': 'aruni', 'Ash': 'ash',
    'Azami': 'azami', 'Bandit': 'bandit', 'Blackbeard': 'blackbeard', 'Blitz': 'blitz',
    'Brava': 'brava', 'Buck': 'buck', 'Capitão': 'capitao', 'Castle': 'castle',
    'Caveira': 'caveira', 'Clash': 'clash', 'Deimos': 'deimos', 'Denari': 'denari',
    'Doc': 'doc', 'Dokkaebi': 'dokkaebi', 'Echo': 'echo', 'Ela': 'ela',
    'Fenrir': 'fenrir', 'Finka': 'finka', 'Flores': 'flores', 'Frost': 'frost',
    'Fuze': 'fuze', 'Glaz': 'glaz', 'Goyo': 'goyo', 'Gridlock': 'gridlock',
    'Grim': 'grim', 'Hibana': 'hibana', 'IQ': 'iq', 'Iana': 'iana',
    'Jackal': 'jackal', 'Jäger': 'jager', 'Kaid': 'kaid', 'Kali': 'kali',
    'Kapkan': 'kapkan', 'Lesion': 'lesion', 'Lion': 'lion', 'Maestro': 'maestro',
    'Maverick': 'maverick', 'Melusi': 'melusi', 'Mira': 'mira', 'Montagne': 'montagne',
    'Mozzie': 'mozzie', 'Mute': 'mute', 'Nomad': 'nomad', 'Nøkk': 'nokk',
    'Oryx': 'oryx', 'Osa': 'osa', 'Pulse': 'pulse', 'Ram': 'ram',
    'Rauora': 'rauora', 'Rook': 'rook', 'Sens': 'sens', 'Sentry': 'sentry',
    'Skopos': 'skopos', 'Sledge': 'sledge', 'Smoke': 'smoke', 'Solis': 'solis',
    'Striker': 'striker', 'Tachanka': 'tachanka', 'Thatcher': 'thatcher',
    'Thermite': 'thermite', 'Thorn': 'thorn', 'Thunderbird': 'thunderbird',
    'Tubarão': 'tubarao', 'Twitch': 'twitch', 'Valkyrie': 'valkyrie',
    'Vigil': 'vigil', 'Wamai': 'wamai', 'Warden': 'warden', 'Ying': 'ying',
    'Zero': 'zero', 'Zofia': 'zofia'
};

// 获取干员图标URL，没有图标的返回null
function getOperatorIconURL(name) {
    const key = OPERATOR_ICON_MAP[name];
    return key ? OPERATOR_ICON_CDN + key + '.svg' : null;
}

// ---- 完整武器数据库 ----
const WEAPONS = [

    // ============================================================
    //                       主 武 器
    // ============================================================

    // ===== 突击步枪 (AR) =====
    { name: 'M4', type: 'ar', damage: 44, rpm: 750, mag: 30, operators: ['Maverick','Striker'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'Commando 9', type: 'ar', damage: 36, rpm: 780, mag: 25, operators: ['Mozzie','Sentry','Noor'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'L85A2', type: 'ar', damage: 47, rpm: 670, mag: 30, operators: ['Sledge','Thatcher'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: ['angled_grip'] } },
    { name: 'AR33', type: 'ar', damage: 41, rpm: 749, mag: 25, operators: ['Thatcher','Flores'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'G36C', type: 'ar', damage: 38, rpm: 780, mag: 30, operators: ['Ash','Iana'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'R4-C', type: 'ar', damage: 39, rpm: 860, mag: 25, operators: ['Ash','Ram'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: ['angled_grip'] } },
    { name: '556XI', type: 'ar', damage: 47, rpm: 690, mag: 30, operators: ['Thermite','Osa'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'F2', type: 'ar', damage: 37, rpm: 980, mag: 25, operators: ['Twitch','Solid Snake'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] },
      y11s1_new: { grips: ['vertical_grip','angled_grip'] },
      notes: 'Y11S1新增垂直/转角握把' },
    { name: 'AK-12', type: 'ar', damage: 40, rpm: 850, mag: 30, operators: ['Fuze','Ace'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'AUG A2', type: 'ar', damage: 42, rpm: 720, mag: 30, operators: ['IQ','Wamai'], side: 'mixed',
      barrels: ['muzzle_brake','flash_hider','suppressor'],
      grips: ['vertical_grip'],
      y7s3_new: { barrels: ['muzzle_brake'], grips: [] } },
    { name: '552 Commando', type: 'ar', damage: 43, rpm: 690, mag: 30, operators: ['IQ','Grim'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: '416-C CARBINE', type: 'ar', damage: 38, rpm: 740, mag: 25, operators: ['Jäger'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: ['angled_grip'] } },
    { name: 'C8-SFW', type: 'ar', damage: 40, rpm: 837, mag: 30, operators: ['Buck'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: [],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] },
      notes: 'Skeleton Key占用握把槽' },
    { name: 'Mk17 CQB', type: 'ar', damage: 44, rpm: 585, mag: 20, operators: ['Blackbeard'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'PARA-308', type: 'ar', damage: 47, rpm: 650, mag: 30, operators: ['Capitão','Brava'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'Type-89', type: 'ar', damage: 40, rpm: 850, mag: 20, operators: ['Hibana'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'C7E', type: 'ar', damage: 42, rpm: 800, mag: 30, operators: ['Jackal'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'M762', type: 'ar', damage: 45, rpm: 730, mag: 30, operators: ['Zofia'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'V308', type: 'ar', damage: 44, rpm: 700, mag: 50, operators: ['Lion'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'Spear .308', type: 'ar', damage: 42, rpm: 700, mag: 30, operators: ['Finka','Thunderbird'], side: 'mixed',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: ['angled_grip'] } },
    { name: 'AR-15.50', type: 'dmr', damage: 59, rpm: 444, mag: 10, operators: ['Maverick','Tubarão'], side: 'mixed',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] },
      barrelNote: 'Y11S3 起 Tubarão 不可装枪口制退器（Maverick 保留）',
      notes: '半自动' },
    { name: 'AK-74M', type: 'ar', damage: 44, rpm: 650, mag: 40, operators: ['Nomad','Deimos'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip','horizontal_grip'],
      y7s3_new: { barrels: [], grips: ['vertical_grip','angled_grip','horizontal_grip'] },
      notes: 'Y11S2新增全部握把选项' },
    { name: 'ARX200', type: 'ar', damage: 47, rpm: 700, mag: 20, operators: ['Iana','Nomad'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: ['angled_grip'] } },
    { name: 'F90', type: 'ar', damage: 38, rpm: 780, mag: 30, operators: ['Gridlock'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: ['angled_grip'] } },
    { name: 'SC3000K', type: 'ar', damage: 45, rpm: 800, mag: 25, operators: ['Zero'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'POF-9', type: 'ar', damage: 37, rpm: 740, mag: 50, operators: ['Sens'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'PCX-33', type: 'ar', damage: 36, rpm: 745, mag: 31, operators: ['Skopos'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'XK23', type: 'ar', damage: 49, rpm: 675, mag: 35, operators: ['Dokkaebi','Rauora','Sens'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip','horizontal_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: ['horizontal_grip'] },
      notes: 'Y11S2新武器，加长枪管可提升伤害至54' },

    // ===== 冲锋枪 (SMG) =====
    { name: 'FMG-9', type: 'smg', damage: 34, rpm: 800, mag: 30, operators: ['Smoke','Nøkk','Denari'], side: 'mixed',
      barrels: ['compensator','flash_hider','suppressor','extended_barrel'],
      grips: [],
      y7s3_new: { barrels: ['compensator','extended_barrel'], grips: [] } },
    { name: 'MP5K', type: 'smg', damage: 30, rpm: 800, mag: 30, operators: ['Mute','Wamai'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: [],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'UMP45', type: 'smg', damage: 42, rpm: 600, mag: 25, operators: ['Castle','Pulse'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'MP5', type: 'smg', damage: 27, rpm: 800, mag: 30, operators: ['Doc','Rook','Melusi'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['compensator','extended_barrel'], grips: ['angled_grip'] } },
    { name: 'P90', type: 'smg', damage: 22, rpm: 970, mag: 50, operators: ['Doc','Rook','Solis'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: [],
      y7s3_new: { barrels: ['compensator'], grips: [] } },
    { name: 'MP5SD', type: 'smg', damage: 30, rpm: 800, mag: 30, operators: ['Echo'], side: 'def',
      barrels: [],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] },
      notes: '内置消音器，无法更换枪管' },
    { name: '9x19VSN', type: 'smg', damage: 34, rpm: 750, mag: 30, operators: ['Kapkan','Tachanka','Azami'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'MP7', type: 'smg', damage: 32, rpm: 900, mag: 30, operators: ['Bandit','Zero','Fenrir'], side: 'mixed',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: [],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: '9mm C1', type: 'smg', damage: 36, rpm: 575, mag: 34, operators: ['Frost'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['muzzle_brake','compensator','flash_hider'], grips: ['vertical_grip'] } },
    { name: 'MPX', type: 'smg', damage: 26, rpm: 830, mag: 30, operators: ['Valkyrie','Warden','Tubarão'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'M12', type: 'smg', damage: 42, rpm: 550, mag: 30, operators: ['Caveira'], side: 'def',
      barrels: ['compensator','flash_hider','suppressor','extended_barrel'],
      grips: [],
      y7s3_new: { barrels: ['compensator'], grips: [] } },
    { name: 'PDW9', type: 'smg', damage: 34, rpm: 800, mag: 50, operators: ['Jackal','Osa'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'Vector .45', type: 'smg', damage: 23, rpm: 1200, mag: 25, operators: ['Mira','Goyo'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: ['angled_grip'] } },
    { name: 'T-5 SMG', type: 'smg', damage: 28, rpm: 900, mag: 30, operators: ['Lesion','Oryx'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: ['vertical_grip','angled_grip'] } },
    { name: 'Scorpion EVO', type: 'smg', damage: 23, rpm: 1080, mag: 40, operators: ['Ela','Denari'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'K1A', type: 'smg', damage: 36, rpm: 720, mag: 30, operators: ['Vigil'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'Mx4 Storm', type: 'smg', damage: 26, rpm: 950, mag: 30, operators: ['Alibi'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'AUG A3', type: 'smg', damage: 36, rpm: 700, mag: 31, operators: ['Kaid'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'P10 RONI', type: 'smg', damage: 26, rpm: 980, mag: 15, operators: ['Mozzie','Aruni'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'UZK50GI', type: 'smg', damage: 36, rpm: 700, mag: 22, operators: ['Thorn'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },

    // ===== 轻机枪 (LMG) =====
    { name: 'M249', type: 'lmg', damage: 48, rpm: 650, mag: 100, operators: ['Capitão','Striker','Rauora'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['muzzle_brake'], grips: ['angled_grip'] } },
    { name: '6P41', type: 'lmg', damage: 46, rpm: 680, mag: 100, operators: ['Fuze','Finka'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['muzzle_brake','compensator'], grips: ['angled_grip'] } },
    { name: 'G8A1', type: 'lmg', damage: 37, rpm: 850, mag: 50, operators: ['IQ','Amaru'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['muzzle_brake'], grips: [] } },
    { name: 'T-95 LSW', type: 'lmg', damage: 46, rpm: 650, mag: 80, operators: ['Ying','Flores'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'LMG-E', type: 'lmg', damage: 41, rpm: 720, mag: 150, operators: ['Zofia','Ram'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'ALDA 5.56', type: 'lmg', damage: 35, rpm: 900, mag: 80, operators: ['Maestro','Noor'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'M249 SAW', type: 'lmg', damage: 48, rpm: 650, mag: 60, operators: ['Gridlock'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['muzzle_brake','compensator'], grips: ['angled_grip'] } },
    { name: 'DP27', type: 'lmg', damage: 60, rpm: 550, mag: 70, operators: ['Tachanka'], side: 'def',
      barrels: [],
      grips: [],
      y7s3_new: { barrels: [], grips: [] },
      notes: '仅可装瞄准镜+激光' },

    // ===== 狙击步枪 (Sniper) =====
    { name: 'CSRX 300', type: 'sniper', damage: 135, rpm: 63, mag: 5, operators: ['Kali'], side: 'atk',
      barrels: [],
      grips: [],
      y7s3_new: { barrels: [], grips: [] },
      notes: '栓动狙击步枪，内置 3.5x/8x 倍镜（Y11S3 由 5x/12x 下调）' },

    // ===== 射手步枪 (DMR) =====
    { name: '417', type: 'dmr', damage: 69, rpm: 444, mag: 20, operators: ['Twitch','Lion','Sens','Rauora'], side: 'atk',
      barrels: ['muzzle_brake','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: ['angled_grip'] } },
    { name: 'OTs-03', type: 'dmr', damage: 71, rpm: 374, mag: 15, operators: ['Glaz'], side: 'atk',
      barrels: ['muzzle_brake','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: ['vertical_grip','angled_grip'] } },
    { name: 'CAMRS', type: 'dmr', damage: 69, rpm: 442, mag: 20, operators: ['Buck','Brava'], side: 'atk',
      barrels: ['muzzle_brake','suppressor'],
      grips: [],
      y7s3_new: { barrels: [], grips: [] },
      notes: 'Skeleton Key占用握把槽' },
    { name: 'SR-25', type: 'dmr', damage: 61, rpm: 439, mag: 20, operators: ['Blackbeard','Flores','Striker'], side: 'atk',
      barrels: ['muzzle_brake','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: ['angled_grip'] } },
    { name: 'Mk 14 EBR', type: 'dmr', damage: 56, rpm: 444, mag: 20, operators: ['Dokkaebi','Aruni'], side: 'mixed',
      barrels: ['muzzle_brake','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] },
      barrelNote: 'Y11S3 起 Aruni 不可装枪口制退器（Dokkaebi 保留）' },
    { name: 'PMR90A2', type: 'dmr', damage: 62, rpm: 444, mag: 20, operators: ['Solid Snake','Thatcher','Capitão','Hibana','Nøkk'], side: 'atk',
      barrels: ['muzzle_brake','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] },
      notes: 'Y11S1新增射手步枪' },

    // ===== 霰弹枪 (Shotgun - 弹丸) =====
    // 伤害为单颗弹丸伤害（每发8颗弹丸），数据源: GitHub实测Y11S1.1 + 灰机wiki面板
    { name: 'M870', type: 'shotgun', damage: 42, rpm: 0, mag: 7, operators: ['Bandit','Jäger','Thorn','Sentry'], side: 'def',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '泵动霰弹枪' },
    { name: 'M590A1', type: 'shotgun', damage: 48, rpm: 0, mag: 7, operators: ['Smoke','Mute','Thatcher','Sledge','Warden','Deimos'], side: 'mixed',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '泵动霰弹枪' },
    { name: 'M1014', type: 'shotgun', damage: 28, rpm: 0, mag: 8, operators: ['Thermite','Castle','Pulse','Ace'], side: 'mixed',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '半自动霰弹枪' },
    { name: 'SG-CQB', type: 'shotgun', damage: 44, rpm: 0, mag: 7, operators: ['Doc','Rook','Twitch','Grim','Lion'], side: 'mixed',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '泵动霰弹枪' },
    { name: 'SASG-12', type: 'shotgun', damage: 26, rpm: 0, mag: 10, operators: ['Finka','Kapkan','Fenrir'], side: 'def',
      barrels: [], grips: ['vertical_grip','angled_grip'], y7s3_new: { barrels: [], grips: [] }, notes: '半自动霰弹枪' },
    { name: 'SUPER 90', type: 'shotgun', damage: 27, rpm: 0, mag: 8, operators: ['Frost','Melusi'], side: 'def',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '半自动霰弹枪' },
    { name: 'SPAS-12', type: 'shotgun', damage: 31, rpm: 0, mag: 7, operators: ['Valkyrie','Oryx'], side: 'def',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '半自动霰弹枪' },
    { name: 'SPAS-15', type: 'shotgun', damage: 24, rpm: 0, mag: 6, operators: ['Caveira','Thunderbird'], side: 'def',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '半自动霰弹枪' },
    { name: 'SuperNova', type: 'shotgun', damage: 48, rpm: 0, mag: 7, operators: ['Echo','Hibana','Amaru'], side: 'mixed',
      barrels: ['suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '泵动霰弹枪' },
    { name: 'FO-12', type: 'shotgun', damage: 26, rpm: 0, mag: 10, operators: ['Ela'], side: 'def',
      barrels: ['extended_barrel'], grips: ['vertical_grip','angled_grip'], y7s3_new: { barrels: [], grips: [] }, notes: '全自动霰弹枪' },
    { name: 'SIX12', type: 'shotgun', damage: 46, rpm: 0, mag: 6, operators: ['Ying'], side: 'atk',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '左轮式霰弹枪' },
    { name: 'SIX12 SD', type: 'shotgun', damage: 46, rpm: 0, mag: 6, operators: ['Lesion','Nøkk'], side: 'mixed',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '消音版左轮式霰弹枪' },
    { name: 'ITA12L', type: 'shotgun', damage: 41, rpm: 0, mag: 8, operators: ['Jackal','Mira','Solis'], side: 'mixed',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '泵动霰弹枪（长管版）' },

    // ===== 独头霰弹枪 (Slug) =====
    // 伤害为单发伤害（单颗独头弹），数据源: GitHub实测Y11S1.1 + 灰机wiki面板
    { name: 'BOSG.12.2', type: 'slug', damage: 125, rpm: 0, mag: 2, operators: ['Vigil','Dokkaebi'], side: 'mixed',
      barrels: [], grips: ['vertical_grip','angled_grip'], y7s3_new: { barrels: [], grips: [] }, notes: '双管独头弹' },
    { name: 'ACS12', type: 'slug', damage: 69, rpm: 300, mag: 30, operators: ['Maestro','Alibi','Azami'], side: 'def',
      barrels: [], grips: ['angled_grip'], y7s3_new: { barrels: [], grips: [] }, notes: '半自动独头弹' },
    { name: 'TCSG12', type: 'slug', damage: 75, rpm: 487, mag: 10, operators: ['Kaid','Goyo','Sentry'], side: 'def',
      barrels: ['suppressor'], grips: ['vertical_grip','angled_grip'], y7s3_new: { barrels: [], grips: [] }, notes: '半自动独头弹' },
    { name: 'Glaive-12', type: 'slug', damage: 67, rpm: 0, mag: 4, operators: ['Denari'], side: 'def',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '独头霰弹枪' },


    // ============================================================
    //                       副 武 器
    // ============================================================

    // ===== 霰弹枪·次要 (Secondary Shotgun) =====
    { name: 'ITA12S', type: 'shotgun_sec', damage: 29, rpm: 0, mag: 5, operators: ['Jackal','Mira','Thermite','Thunderbird','Melusi','Frost','Amaru','Striker'], side: 'mixed',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '副武器泵动霰弹枪' },
    { name: 'Super Shorty', type: 'shotgun_sec', damage: 35, rpm: 0, mag: 3, operators: ['Castle','Gridlock','Wamai','Brava','Clash','Sentry'], side: 'mixed',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '副武器短管霰弹枪' },

    // ===== 手枪 (Pistol) =====
    { name: '5.7 USG', type: 'pistol', damage: 42, rpm: 0, mag: 20, operators: ['Zero','Nøkk','Castle','Thermite','Fenrir','Ash','Pulse','Striker'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'P226 MK 25', type: 'pistol', damage: 50, rpm: 0, mag: 15, operators: ['Sledge','Thatcher','Smoke','Mute','Kali','Tubarão','Denari'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'M45 MEUSOC', type: 'pistol', damage: 58, rpm: 0, mag: 7, operators: ['Castle','Pulse','Thermite','Ash'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'P9', type: 'pistol', damage: 45, rpm: 0, mag: 16, operators: ['Doc','Rook','Twitch','Lion','Montagne','Ace'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'PMM', type: 'pistol', damage: 61, rpm: 0, mag: 8, operators: ['Fuze','Glaz','Kapkan','Tachanka','Finka','Osa'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'GSH-18', type: 'pistol', damage: 44, rpm: 0, mag: 18, operators: ['Fuze','Glaz','Kapkan','Tachanka','Finka','Rauora','Flores'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'P12', type: 'pistol', damage: 44, rpm: 0, mag: 15, operators: ['Bandit','Jäger','IQ','Blitz','Wamai'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'Mk1 9mm', type: 'pistol', damage: 48, rpm: 0, mag: 13, operators: ['Buck','Frost','Ram','Iana'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'D-50', type: 'pistol', damage: 71, rpm: 0, mag: 7, operators: ['Blackbeard','Valkyrie','Nøkk','Azami'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: '高伤害沙漠之鹰' },
    { name: 'PRB92', type: 'pistol', damage: 42, rpm: 0, mag: 15, operators: ['Capitão','Caveira','Aruni','Nomad'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'Luison', type: 'pistol', damage: 65, rpm: 0, mag: 12, operators: ['Caveira'], side: 'def',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: 'Caveira专属，内置消音器，可审讯倒地敌人' },
    { name: 'P229', type: 'pistol', damage: 51, rpm: 0, mag: 12, operators: ['Hibana','Echo','Skopos','Goyo','Grim'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'Q-929', type: 'pistol', damage: 60, rpm: 0, mag: 10, operators: ['Ying','Lesion','Thunderbird'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'RG15', type: 'pistol', damage: 38, rpm: 0, mag: 15, operators: ['Ela','Zofia','Melusi'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: '内置微型红点瞄具' },
    { name: '1911 TACOPS', type: 'pistol', damage: 55, rpm: 0, mag: 8, operators: ['Maverick','Thorn','Noor'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'USP40', type: 'pistol', damage: 48, rpm: 0, mag: 12, operators: ['Jackal','Mira','Oryx','Brava'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: '.44 Mag Semi-Auto', type: 'pistol', damage: 54, rpm: 0, mag: 7, operators: ['Kaid','Nomad'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: '高伤害半自动' },
    { name: 'SDP 9mm', type: 'pistol', damage: 47, rpm: 0, mag: 16, operators: ['Gridlock','Mozzie','Sens'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'P-10C', type: 'pistol', damage: 40, rpm: 0, mag: 15, operators: ['Warden','Clash','Jäger'], side: 'def',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'GONNE-6', type: 'pistol', damage: 10, rpm: 0, mag: 1, operators: ['Glaz','Dokkaebi','Finka','Iana','Gridlock','Amaru','Flores','Zero','Sens','Lion','Nøkk'], side: 'atk',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: '单发破坏工具，可摧毁防弹设备' },
    { name: 'TACIT .45', type: 'pistol', damage: 52, rpm: 0, mag: 8, operators: ['Solid Snake'], side: 'atk',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: 'Y11S1新增，内置消音器+反射瞄具' },
    { name: 'Bailiff 410', type: 'pistol', damage: 30, rpm: 0, mag: 5, operators: ['Maestro','Alibi','Oryx','Doc','Grim','Noor'], side: 'def',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: '副武器左轮霰弹枪，主要用于开洞' },
    { name: '.44 Vendetta', type: 'revolver', damage: 78, rpm: 0, mag: 6, operators: ['Deimos'], side: 'atk',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: 'Deimos专属高伤害左轮' },

    // ===== 冲锋枪·次要 (Secondary SMG / Machine Pistol) =====
    { name: 'C75 Auto', type: 'smg_sec', damage: 35, rpm: 1000, mag: 26, operators: ['Dokkaebi','Vigil','Thorn','Kali','Sentry'], side: 'mixed',
      barrels: ['compensator','suppressor'],
      grips: [],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'SMG-11', type: 'smg_sec', damage: 32, rpm: 1270, mag: 16, operators: ['Smoke','Mute','Sledge','Amaru','Solis'], side: 'mixed',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['angled_grip'],
      y7s3_new: { barrels: ['muzzle_brake','extended_barrel'], grips: ['angled_grip'] } },
    { name: 'SMG-12', type: 'smg_sec', damage: 16, rpm: 1273, mag: 22, operators: ['Dokkaebi','Vigil','Warden'], side: 'mixed',
      barrels: ['compensator','flash_hider','suppressor'],
      grips: ['angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'Bearing 9', type: 'smg_sec', damage: 33, rpm: 1100, mag: 25, operators: ['Hibana','Echo','Tachanka','Thunderbird','Glaz'], side: 'mixed',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: [],
      y7s3_new: { barrels: ['muzzle_brake','extended_barrel'], grips: [] } },
    { name: 'SPSMG9', type: 'smg_sec', damage: 35, rpm: 980, mag: 20, operators: ['Kali','Clash'], side: 'mixed',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: [],
      y7s3_new: { barrels: ['muzzle_brake','compensator','extended_barrel'], grips: [] } },
    { name: 'Reaper MK2', type: 'smg_sec', damage: 31, rpm: 765, mag: 33, operators: ['Oryx','Pulse','Rook','Sledge','Ying','Maverick','Rauora'], side: 'mixed',
      barrels: ['compensator','flash_hider','suppressor'],
      grips: [],
      y7s3_new: { barrels: [], grips: [] },
      notes: 'Y10S3 分配给 Oryx/Pulse/Rook/Sledge/Ying' },

    // ===== 左轮手枪 (Revolver) =====
    { name: 'LFP586', type: 'revolver', damage: 78, rpm: 0, mag: 6, operators: ['Doc','Rook','Twitch','Lion','Montagne','Kaid'], side: 'mixed',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: '.357 Magnum 左轮' },
    { name: 'Keratos .357', type: 'revolver', damage: 78, rpm: 0, mag: 6, operators: ['Maestro','Alibi','Bandit','Wamai'], side: 'mixed',
      barrels: ['suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: '可装消音器的左轮' },
    { name: 'GONNE-6 Rev', type: 'revolver', damage: 78, rpm: 0, mag: 5, operators: ['Kaid','Nomad'], side: 'mixed',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: '.44 Mag 左轮（非半自动版）' }
];

// ---- 武器扩展数据 ----
// 瞄具/下挂/机动性/换弹时间/后坐力模式/伤害衰减
// 伤害衰减规则 (Bruce游戏内实测 2026-04-01):
//   衰减公式: min = floor(damage × 衰减系数), 衰减区间内线性递减后向下取整
//   突击步枪(ar):      系数0.6, 25-35m  | 冲锋枪(smg):      系数0.6, 18-28m
//   轻机枪(lmg):       系数0.65, 30-40m | 狙击枪(sniper):    系数0.8, 30-40m
//   射手步枪(dmr):     系数0.7, 30-40m  | 独头霰弹枪(slug):  系数0.6, 15-25m
//   手枪(pistol):      系数0.6, 12-15m  | 副武器SMG(smg_sec): 系数0.6, 18-28m
//   左轮(revolver):    系数0.6, 12-15m
//   多头霰弹枪(shotgun/shotgun_sec): 双段衰减 5-7m(系数0.75) + 10-13m(系数0.6), 二次衰减不中间取整
const WEAPON_EXTENDED = {
    // === 突击步枪 ===
    'M4': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.7, reloadEmpty: 3.3,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '稳定上升，略向右偏' },
        falloff: { start: 25, end: 35, min: 26 },
        falloffExt: { start: 26, end: 35, min: 39 },
    },
    'Commando 9': {
        sights: ['red_dot', 'holographic', 'reflex'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.4, reloadEmpty: 3.1,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '非常平稳，几乎直线上升' },
        falloff: { start: 25, end: 35, min: 21 },
        falloffExt: { start: 26, end: 34, min: 32 },
    },
    'L85A2': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.7, reloadEmpty: 3.3,
        recoil: { vertical: 'low', horizontal: 'high', pattern: '垂直后坐力低，水平晃动大' },
        falloff: { start: 25, end: 35, min: 28 }
    },
    'AR33': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.9, reloadEmpty: 3.6,
        recoil: { vertical: 'medium', horizontal: 'medium', pattern: '中等后坐力，有轻微左右摇摆' },
        falloff: { start: 25, end: 35, min: 24 }
    },
    'G36C': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.9, reloadEmpty: 3.4,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '后坐力非常小，容易控制' },
        falloff: { start: 25, end: 35, min: 22 },
        falloffExt: { start: 27, end: 35, min: 33 },
    },
    'R4-C': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.7, reloadEmpty: 3.4,
        recoil: { vertical: 'high', horizontal: 'low', pattern: '垂直后坐力高，水平偏移小' },
        falloff: { start: 25, end: 35, min: 23 },
        falloffExt: { start: 27, end: 35, min: 34 },
    },
    '556XI': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.9, reloadEmpty: 3.6,
        recoil: { vertical: 'medium', horizontal: 'medium', pattern: '中等后坐力，稳定可控' },
        falloff: { start: 25, end: 35, min: 28 }
    },
    'F2': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.6, reloadEmpty: 3.3,
        recoil: { vertical: 'very_high', horizontal: 'medium', pattern: '极高射速导致极高垂直后坐力，需要强力下压' },
        falloff: { start: 25, end: 35, min: 22 },
        falloffExt: { start: 26, end: 34, min: 33 },
    },
    'AK-12': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.6, reloadEmpty: 3.4,
        recoil: { vertical: 'high', horizontal: 'high', pattern: '前几发稳定，第4发后水平后坐力恶化' },
        falloff: { start: 25, end: 35, min: 24 }
    },
    'AUG A2': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        sightNote: '2.5x 放大镜仅进攻方干员可用',
        underbarrel: true, mobility: 50,
        reloadTactical: 2.5, reloadEmpty: 3.0,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '非常稳定，适合新手' },
        falloff: { start: 25, end: 35, min: 25 }
    },
    '552 Commando': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.9, reloadEmpty: 3.6,
        recoil: { vertical: 'medium', horizontal: 'medium', pattern: '中等后坐力，弹道略向右偏' },
        falloff: { start: 25, end: 35, min: 25 },
        falloffExt: { start: 26, end: 35, min: 38 },
    },
    '416-C CARBINE': {
        sights: ['red_dot', 'holographic', 'reflex'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.8, reloadEmpty: 3.6,
        recoil: { vertical: 'low_medium', horizontal: 'low', pattern: 'Y11S2.2降低垂直后坐力+平滑水平，最难控段从第8发推迟到第10发，整体更易控' },
        falloff: { start: 25, end: 35, min: 22 },
        falloffExt: { start: 27, end: 35, min: 33 },
    },
    'C8-SFW': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: false, mobility: 50,
        reloadTactical: 2.7, reloadEmpty: 3.3,
        recoil: { vertical: 'very_high', horizontal: 'medium', pattern: '极高后坐力，Skeleton Key占用下挂' },
        falloff: { start: 25, end: 35, min: 24 },
        falloffExt: { start: 27, end: 35, min: 35 },
    },
    'Mk17 CQB': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.8, reloadEmpty: 3.6,
        recoil: { vertical: 'high', horizontal: 'medium', pattern: '7.62mm大口径，单发后坐力大但射速低补偿' },
        falloff: { start: 25, end: 35, min: 26 },
        falloffExt: { start: 26, end: 35, min: 39 },
    },
    'PARA-308': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: true, mobility: 50,
        reloadTactical: 3.0, reloadEmpty: 3.8,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '中等后坐力，弹道偏右' },
        falloff: { start: 25, end: 35, min: 28 },
        falloffExt: { start: 26, end: 34, min: 42 },
    },
    'Type-89': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.3, reloadEmpty: 3.0,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '中等垂直后坐力，水平稳定' },
        falloff: { start: 25, end: 35, min: 24 }
    },
    'C7E': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.7, reloadEmpty: 3.3,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '非常平稳的弹道，容易全自动控枪' },
        falloff: { start: 25, end: 35, min: 25 }
    },
    'M762': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.8, reloadEmpty: 3.5,
        recoil: { vertical: 'high', horizontal: 'high', pattern: '高后坐力，弹道呈S形左右摇摆' },
        falloff: { start: 25, end: 35, min: 27 }
    },
    'V308': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: true, mobility: 50,
        reloadTactical: 3.2, reloadEmpty: 4.0,
        recoil: { vertical: 'medium', horizontal: 'medium', pattern: '中等后坐力，50发弹匣提供持续火力' },
        falloff: { start: 25, end: 35, min: 26 }
    },
    'Spear .308': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        sightNote: '2.5x 放大镜仅进攻方干员可用',
        underbarrel: true, mobility: 50,
        reloadTactical: 2.8, reloadEmpty: 3.5,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '低后坐力，非常容易控制' },
        falloff: { start: 25, end: 35, min: 25 },
        falloffExt: { start: 25, end: 35, min: 37 },
    },
    'AR-15.50': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified', 'telescopic'],
        sightNote: '2.5x 放大镜仅进攻方干员可用；防守方 Tubarão 亦在官方白名单内；3.5x 望远镜仅进攻方 DMR 可用',
        underbarrel: true, mobility: 50,
        reloadTactical: 2.8, reloadEmpty: 3.5,
        recoil: { vertical: 'high', horizontal: 'low', pattern: '半自动，单发后坐力大但有恢复时间；Y11S3 首发后坐力提升' },
        falloff: { start: 30, end: 40, min: 41 } // [Y11S3 实测] 59→41 (29-40m)
    },
    'AK-74M': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: false, mobility: 50,
        reloadTactical: 2.8, reloadEmpty: 3.5,
        recoil: { vertical: 'medium', horizontal: 'medium', pattern: '典型AK后坐力模式，Y11S2新增全部握把可改善控枪' },
        falloff: { start: 25, end: 35, min: 26 }
    },
    'ARX200': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.6, reloadEmpty: 3.2,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '中等后坐力，水平稳定' },
        falloff: { start: 25, end: 35, min: 28 }
    },
    'F90': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.5, reloadEmpty: 3.0,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '低后坐力，适合远距离连射' },
        falloff: { start: 25, end: 35, min: 22 },
        falloffExt: { start: 27, end: 35, min: 33 },
    },
    'SC3000K': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.6, reloadEmpty: 3.3,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '中等后坐力，整体平稳' },
        falloff: { start: 25, end: 35, min: 27 },
        falloffExt: { start: 26, end: 35, min: 40 },
    },
    'POF-9': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.5, reloadEmpty: 3.2,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '9mm口径，后坐力非常小' },
        falloff: { start: 25, end: 35, min: 22 },
        falloffExt: { start: 26, end: 34, min: 33 },
    },
    'PCX-33': {
        sights: ['red_dot', 'holographic', 'reflex'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.5, reloadEmpty: 3.2,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '低后坐力，防守方可用' },
        falloff: { start: 25, end: 35, min: 21 },
        falloffExt: { start: 26, end: 34, min: 32 },
    },
    'XK23': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: true, mobility: 50,
        reloadTactical: 3.5, reloadEmpty: null,
        recoil: { vertical: 'low-medium', horizontal: 'low', pattern: '易控制、稳定一致的后坐力模式' },
        falloff: { start: 25, end: 35, min: 29 },
        falloffExt: { start: 27, end: 35, min: 43 },
    },

    // === 冲锋枪 ===
    'FMG-9': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        sightNote: '2.5x 放大镜仅进攻方干员可用',
        underbarrel: true, mobility: 50,
        reloadTactical: 2.2, reloadEmpty: 2.8,
        recoil: { vertical: 'low', horizontal: 'medium', pattern: '低垂直，中等水平后坐力' },
        falloff: { start: 18, end: 28, min: 20 },
        falloffExt: { start: 18, end: 28, min: 30 },
    },
    'MP5K': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        sightNote: '2.5x 放大镜仅 Wamai 可用',
        underbarrel: true, mobility: 50,
        reloadTactical: 2.3, reloadEmpty: 2.9,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '低后坐力，适合近距离扫射' },
        falloff: { start: 18, end: 28, min: 18 },
        falloffExt: { start: 20, end: 28, min: 26 },
    },
    'UMP45': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        sightNote: '2.5x 放大镜仅 Castle 可用',
        underbarrel: true, mobility: 50,
        reloadTactical: 2.3, reloadEmpty: 2.9,
        recoil: { vertical: 'very_low', horizontal: 'very_low', pattern: '几乎无后坐力，激光般稳定' },
        falloff: { start: 18, end: 28, min: 25 },
        falloffExt: { start: 18, end: 28, min: 37 },
    },
    'MP5': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        sightNote: '2.5x 放大镜仅 Doc/Melusi/Rook 可用',
        underbarrel: true, mobility: 50,
        reloadTactical: 2.3, reloadEmpty: 2.9,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '低后坐力，滚柱闭锁带来平稳射击' },
        falloff: { start: 18, end: 28, min: 16 },
        falloffExt: { start: 19, end: 27, min: 24 },
    },
    'P90': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        sightNote: '2.5x 放大镜仅 Doc/Rook 可用',
        underbarrel: true, mobility: 50,
        reloadTactical: 2.4, reloadEmpty: 3.0,
        recoil: { vertical: 'medium', horizontal: 'medium', pattern: '中等后坐力，高射速需要控制' },
        falloff: { start: 18, end: 28, min: 13 },
        falloffExt: { start: 21, end: 28, min: 19 },
    },
    'MP5SD': {
        sights: ['red_dot', 'holographic', 'reflex'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.3, reloadEmpty: 2.9,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '与MP5相似的低后坐力' },
        falloff: { start: 18, end: 28, min: 18 }
    },
    '9x19VSN': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        sightNote: '2.5x 放大镜仅 Tachanka 可用',
        underbarrel: true, mobility: 50,
        reloadTactical: 2.4, reloadEmpty: 3.0,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '非常稳定的弹道' },
        falloff: { start: 18, end: 28, min: 20 },
        falloffExt: { start: 18, end: 28, min: 30 },
    },
    'MP7': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        sightNote: '2.5x 放大镜仅进攻方干员可用',
        underbarrel: true, mobility: 50,
        reloadTactical: 2.2, reloadEmpty: 2.8,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '中等垂直后坐力，水平稳定' },
        falloff: { start: 18, end: 28, min: 19 },
        falloffExt: { start: 20, end: 28, min: 28 },
    },
    '9mm C1': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        sightNote: '2.5x 放大镜仅 Frost 可用',
        underbarrel: true, mobility: 50,
        reloadTactical: 2.2, reloadEmpty: 2.8,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '低射速带来极低后坐力' },
        falloff: { start: 18, end: 28, min: 21 },
        falloffExt: { start: 19, end: 27, min: 32 },
    },
    'MPX': {
        sights: ['red_dot', 'holographic', 'reflex'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.2, reloadEmpty: 2.8,
        recoil: { vertical: 'very_low', horizontal: 'very_low', pattern: '接近零后坐力，被称为"激光枪"' },
        falloff: { start: 18, end: 28, min: 15 },
        falloffExt: { start: 19, end: 27, min: 23 },
    },
    'M12': {
        sights: ['red_dot', 'holographic', 'reflex'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.2, reloadEmpty: 2.8,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '低射速带来稳定后坐力' },
        falloff: { start: 18, end: 28, min: 25 },
        falloffExt: { start: 18, end: 28, min: 37 },
    },
    'PDW9': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.5, reloadEmpty: 3.1,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '低后坐力，50发弹匣提供持续火力' },
        falloff: { start: 18, end: 28, min: 20 },
        falloffExt: { start: 18, end: 28, min: 30 },
    },
    'Vector .45': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        sightNote: '2.5x 放大镜仅 Goyo 可用',
        underbarrel: true, mobility: 50,
        reloadTactical: 2.0, reloadEmpty: 2.8,
        recoil: { vertical: 'very_low', horizontal: 'high', pattern: '垂直极低(Super V系统)，水平随机且大' },
        falloff: { start: 18, end: 28, min: 13 },
        falloffExt: { start: 21, end: 28, min: 20 },
    },
    'T-5 SMG': {
        sights: ['red_dot', 'holographic', 'reflex'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.3, reloadEmpty: 2.9,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '低后坐力，近距离非常好用' },
        falloff: { start: 18, end: 28, min: 16 },
        falloffExt: { start: 19, end: 27, min: 25 },
    },
    'Scorpion EVO': {
        sights: ['red_dot', 'holographic', 'reflex'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.5, reloadEmpty: 3.1,
        recoil: { vertical: 'very_high', horizontal: 'very_high', pattern: '极高后坐力，全游戏最难控制的冲锋枪之一' },
        falloff: { start: 18, end: 28, min: 13 }
    },
    'K1A': {
        sights: ['red_dot', 'holographic', 'reflex'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.4, reloadEmpty: 3.0,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '中等后坐力，容易控制' },
        falloff: { start: 18, end: 28, min: 21 },
        falloffExt: { start: 19, end: 27, min: 32 },
    },
    'Mx4 Storm': {
        sights: ['red_dot', 'holographic', 'reflex'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.2, reloadEmpty: 2.8,
        recoil: { vertical: 'low', horizontal: 'medium', pattern: '低垂直，中等水平后坐力' },
        falloff: { start: 18, end: 28, min: 15 },
        falloffExt: { start: 19, end: 27, min: 23 },
    },
    'AUG A3': {
        sights: ['red_dot', 'holographic', 'reflex'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.5, reloadEmpty: 3.0,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '犊牛式布局，后坐力稳定' },
        falloff: { start: 18, end: 28, min: 21 },
        falloffExt: { start: 19, end: 27, min: 32 },
    },
    'P10 RONI': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        sightNote: '2.5x 放大镜仅 Mozzie 可用',
        underbarrel: true, mobility: 50,
        reloadTactical: 2.2, reloadEmpty: 2.8,
        recoil: { vertical: 'medium', horizontal: 'medium', pattern: '中等后坐力，15发弹匣限制火力持续' },
        falloff: { start: 18, end: 28, min: 15 },
        falloffExt: { start: 19, end: 27, min: 23 },
    },
    'UZK50GI': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        sightNote: '2.5x 放大镜仅 Thorn 可用',
        underbarrel: true, mobility: 50,
        reloadTactical: 2.4, reloadEmpty: 3.0,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '中等后坐力，整体可控' },
        falloff: { start: 18, end: 28, min: 21 },
        falloffExt: { start: 19, end: 27, min: 32 },
    },

    // === 轻机枪 ===
    'M249': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: true, mobility: 50,
        reloadTactical: 5.5, reloadEmpty: 6.5,
        recoil: { vertical: 'high', horizontal: 'medium', pattern: '高垂直后坐力，弹链供弹换弹极慢' },
        falloff: { start: 30, end: 40, min: 31 }
    },
    '6P41': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: true, mobility: 50,
        reloadTactical: 5.0, reloadEmpty: 6.0,
        recoil: { vertical: 'high', horizontal: 'high', pattern: '高后坐力，弹道不可预测' },
        falloff: { start: 30, end: 40, min: 30 }
    },
    'G8A1': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: true, mobility: 50,
        reloadTactical: 4.5, reloadEmpty: 5.5,
        recoil: { vertical: 'medium', horizontal: 'medium', pattern: '中等后坐力，高射速要求持续下压' },
        falloff: { start: 30, end: 40, min: 24 }
    },
    'T-95 LSW': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: true, mobility: 50,
        reloadTactical: 3.4, reloadEmpty: 4.4,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '中等后坐力，弹鼓供弹' },
        falloff: { start: 30, end: 40, min: 29 }
    },
    'LMG-E': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: true, mobility: 50,
        reloadTactical: 5.0, reloadEmpty: 6.0,
        recoil: { vertical: 'medium', horizontal: 'medium', pattern: '中等后坐力，150发弹匣' },
        falloff: { start: 30, end: 40, min: 26 }
    },
    'ALDA 5.56': {
        sights: ['red_dot', 'holographic', 'reflex'],
        underbarrel: true, mobility: 50,
        reloadTactical: 4.5, reloadEmpty: 5.5,
        recoil: { vertical: 'medium', horizontal: 'high', pattern: '高射速LMG，水平后坐力较大' },
        falloff: { start: 30, end: 40, min: 23 }
    },
    'M249 SAW': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: true, mobility: 50,
        reloadTactical: 4.5, reloadEmpty: 5.5,
        recoil: { vertical: 'medium', horizontal: 'medium', pattern: '中等后坐力，短枪管版本' },
        falloff: { start: 30, end: 40, min: 31 }
    },
    'DP27': {
        sights: ['red_dot', 'holographic', 'reflex'],
        underbarrel: true, mobility: 50,
        reloadTactical: 4.0, reloadEmpty: 5.0,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '低射速带来稳定的后坐力' },
        falloff: { start: 30, end: 40, min: 40 }
    },

    // === 狙击步枪 ===
    'CSRX 300': {
        sights: [],
        underbarrel: false, mobility: 50,
        reloadTactical: 3.8, reloadEmpty: 4.5,
        recoil: { vertical: 'n/a', horizontal: 'n/a', pattern: '栓动步枪，单发射击无连射后坐力' },
        falloff: { start: 30, end: 40, min: 108 }, // [Y11S3 实测] 135→108 (29-40m)
        specialNote: '内置 3.5x/8x 双倍率瞄准镜，不可更换（Y11S3 由 5x/12x 下调；pump 时间 1s→0.8s，总弹药 36→51）'
    },

    // === 射手步枪 ===
    '417': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified', 'telescopic'],
        sightNote: '3.5x 望远镜仅进攻方 DMR 可用',
        underbarrel: true, mobility: 50,
        reloadTactical: 2.9, reloadEmpty: 3.6,
        recoil: { vertical: 'high', horizontal: 'low', pattern: '半自动，单发上跳大但回正快' },
        falloff: { start: 30, end: 40, min: 49 }
    },
    'OTs-03': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified', 'telescopic'],
        sightNote: '3.5x 望远镜仅进攻方 DMR 可用',
        underbarrel: true, mobility: 50,
        reloadTactical: 2.8, reloadEmpty: 3.5,
        recoil: { vertical: 'high', horizontal: 'low', pattern: '半自动，后坐力大但射速慢有恢复时间' },
        falloff: { start: 30, end: 40, min: 57 },
        specialNote: '热感瞄准镜可切换'
    },
    'CAMRS': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified', 'telescopic'],
        sightNote: '3.5x 望远镜仅进攻方 DMR 可用',
        underbarrel: false, mobility: 50,
        reloadTactical: 2.8, reloadEmpty: 3.5,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '半自动，后坐力中等' },
        falloff: { start: 30, end: 40, min: 49 }
    },
    'SR-25': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified', 'telescopic'],
        sightNote: '3.5x 望远镜仅进攻方 DMR 可用',
        underbarrel: true, mobility: 50,
        reloadTactical: 2.9, reloadEmpty: 3.6,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '半自动，20发弹匣提供持续火力' },
        falloff: { start: 30, end: 40, min: 43 }
    },
    'Mk 14 EBR': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified', 'telescopic'],
        sightNote: '2.5x 放大镜仅进攻方干员可用；防守方 Aruni 亦在官方白名单内；3.5x 望远镜仅进攻方 DMR 可用',
        underbarrel: true, mobility: 50,
        reloadTactical: 2.8, reloadEmpty: 3.5,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '半自动，中等后坐力；Y11S3 首发后坐力提升' },
        falloff: { start: 30, end: 40, min: 39 } // [Y11S3 实测] 56→39 (29-40m)
    },
    'PMR90A2': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified', 'telescopic'],
        sightNote: '3.5x 望远镜仅进攻方 DMR 可用',
        underbarrel: true, mobility: 50,
        reloadTactical: 2.8, reloadEmpty: 3.5,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '半自动射手步枪，Y11S1新增' },
        falloff: { start: 30, end: 40, min: 43 }
    },

    // === 霰弹枪 (弹丸) ===
    // 霰弹枪伤害衰减: 每发射出8颗弹丸, falloff的damage值为单颗弹丸伤害
    // falloff格式: { start: 第一段衰减起始(5m), midStart: 第一段衰减结束(7m), mid: 中间伤害值, midEnd: 第二段衰减起始(10m), end: 第二段衰减结束(13m), min: 最低伤害, pellets: 弹丸数 }
    // 第一段衰减: 5-7m, 系数0.75, mid = floor(damage × 0.75)
    // 第二段衰减: 10-13m, 系数0.6 (基于原始伤害), min = floor(damage × 0.75 × 0.6) = floor(damage × 0.45)
    // 二次衰减不在中间取整，一次性完成两次衰减计算后再向下取整
    // ⚠️ 数据可信度说明:
    //   - 标注 [Fandom-verified] 的数据经 Fandom Wiki Siege 页面二次验证
    //   - falloff 为 null 表示暂无可靠来源，宁缺毋错
    //   - 数据源优先级: 育碧官网 > 灰机wiki > Fandom Wiki (需确认为Siege数据)
    'M870': {
        sights: ['red_dot', 'holographic', 'reflex'],
        underbarrel: false, mobility: 50,
        reloadTactical: 4.6, reloadEmpty: 4.6,
        recoil: { vertical: 'high', horizontal: 'low', pattern: '泵动霰弹枪，单发后坐力大但有充足恢复时间' },
        falloff: { start: 5, midStart: 7, mid: 31, midEnd: 10, end: 13, min: 18, pellets: 8 } // [GitHub实测Y11S1.1] 42→31→18
    },
    'M590A1': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        sightNote: '2.5x 放大镜仅进攻方干员可用',
        underbarrel: false, mobility: 50,
        reloadTactical: 4.6, reloadEmpty: 4.6,
        recoil: { vertical: 'high', horizontal: 'low', pattern: '泵动霰弹枪，后坐力大但可控' },
        falloff: { start: 5, midStart: 7, mid: 36, midEnd: 10, end: 13, min: 21, pellets: 8 } // [GitHub实测Y11S1.1] 48→36→21
    },
    'M1014': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        sightNote: '2.5x 放大镜仅进攻方干员可用',
        underbarrel: false, mobility: 50,
        reloadTactical: 4.6, reloadEmpty: 4.6,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '半自动，连续射击后坐力累积' },
        falloff: { start: 5, midStart: 7, mid: 21, midEnd: 10, end: 13, min: 12, pellets: 8 } // [GitHub实测Y11S1.1] 28→21→12
    },
    'SG-CQB': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        sightNote: '2.5x 放大镜仅进攻方干员可用',
        underbarrel: false, mobility: 50,
        reloadTactical: 4.6, reloadEmpty: 4.6,
        recoil: { vertical: 'high', horizontal: 'low', pattern: '泵动霰弹枪，单发伤害高' },
        falloff: { start: 5, midStart: 7, mid: 33, midEnd: 10, end: 13, min: 19, pellets: 8 } // [GitHub实测Y11S1.1] 44→33→19
    },
    'SASG-12': {
        sights: ['red_dot', 'holographic', 'reflex'],
        underbarrel: false, mobility: 50,
        reloadTactical: 2.8, reloadEmpty: 3.5,
        recoil: { vertical: 'medium', horizontal: 'medium', pattern: '半自动，AK平台，弹匣供弹可快速换弹' },
        falloff: { start: 5, midStart: 7, mid: 19, midEnd: 10, end: 13, min: 11, pellets: 8 } // [GitHub实测Y11S1.1] 26→19→11
    },
    'SUPER 90': {
        sights: ['red_dot', 'holographic', 'reflex'],
        underbarrel: false, mobility: 50,
        reloadTactical: 4.6, reloadEmpty: 4.6,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '半自动，惯性闭锁系统后坐力适中' },
        falloff: { start: 5, midStart: 7, mid: 20, midEnd: 10, end: 13, min: 12, pellets: 8 } // [GitHub实测Y11S1.1] 27→20→12
    },
    'SPAS-12': {
        sights: ['red_dot', 'holographic', 'reflex'],
        underbarrel: false, mobility: 50,
        reloadTactical: 4.6, reloadEmpty: 4.6,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '半自动，后坐力中等' },
        falloff: { start: 5, midStart: 7, mid: 23, midEnd: 10, end: 13, min: 13, pellets: 8 } // [GitHub实测Y11S1.1] 31→23→13
    },
    'SPAS-15': {
        sights: ['red_dot', 'holographic', 'reflex'],
        underbarrel: false, mobility: 50,
        reloadTactical: 2.8, reloadEmpty: 3.5,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '半自动，弹匣供弹，后坐力平稳' },
        falloff: { start: 5, midStart: 7, mid: 18, midEnd: 10, end: 13, min: 10, pellets: 8 } // [GitHub实测Y11S1.1] 24→18→10
    },
    'SuperNova': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        sightNote: '2.5x 放大镜仅进攻方干员可用',
        underbarrel: false, mobility: 50,
        reloadTactical: 4.6, reloadEmpty: 4.6,
        recoil: { vertical: 'high', horizontal: 'low', pattern: '泵动霰弹枪，ComforTech缓冲系统' },
        falloff: { start: 5, midStart: 7, mid: 36, midEnd: 10, end: 13, min: 21, pellets: 8 } // [GitHub实测Y11S1.1] 48→36→21
    },
    'FO-12': {
        sights: ['red_dot', 'holographic', 'reflex'],
        underbarrel: false, mobility: 50,
        reloadTactical: 2.34, reloadEmpty: 3.29,
        recoil: { vertical: 'very_high', horizontal: 'high', pattern: '全自动霰弹枪，极高射速带来剧烈后坐力' },
        falloffExt: { start: 6, end: 13, min: 16 },
        falloff: { start: 5, midStart: 7, mid: 18, midEnd: 10, end: 13, min: 10, pellets: 8 } // [GitHub实测Y11S1.1] 24→18→10,
    },
    'SIX12': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        underbarrel: false, mobility: 50,
        reloadTactical: 4.0, reloadEmpty: 4.0,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '旋转弹仓供弹，后坐力中等' },
        falloff: { start: 5, midStart: 7, mid: 34, midEnd: 10, end: 13, min: 20, pellets: 8 } // [GitHub实测Y11S1.1] 46→34→20
    },
    'SIX12 SD': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        sightNote: '2.5x 放大镜仅进攻方干员可用',
        underbarrel: false, mobility: 50,
        reloadTactical: 4.0, reloadEmpty: 4.0,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '自带消音器的旋转弹仓霰弹枪' },
        falloff: { start: 5, midStart: 7, mid: 34, midEnd: 10, end: 13, min: 20, pellets: 8 } // [GitHub实测Y11S1.1] 46→34→20（与SIX12相同）
    },
    'ITA12L': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        sightNote: '2.5x 放大镜仅进攻方干员可用',
        underbarrel: false, mobility: 50,
        reloadTactical: 4.6, reloadEmpty: 4.6,
        recoil: { vertical: 'high', horizontal: 'low', pattern: '泵动霰弹枪，长管版ITA12' },
        falloff: { start: 5, midStart: 7, mid: 30, midEnd: 10, end: 13, min: 18, pellets: 8 } // 基于同类武器衰减模式
    },

    // === 独头霰弹枪 ===
    // 独头弹和普通枪械一样是单段衰减（两段伤害）
    // 衰减规则: 系数0.6, 15-25m, min = floor(damage × 0.6)
    'BOSG.12.2': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        sightNote: '2.5x 放大镜仅进攻方干员可用；防守方 Vigil 亦在官方白名单内',
        underbarrel: false, mobility: 50,
        reloadTactical: 3.0, reloadEmpty: 3.0,
        recoil: { vertical: 'very_high', horizontal: 'low', pattern: '双管独头弹，巨大的单发后坐力' },
        falloff: { start: 15, end: 25, min: 75 } // [GitHub实测Y11S1.1] 125→75 (Y9S4.2: 衰减15-25m, 最低60%)
    },
    'ACS12': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        sightNote: '2.5x 放大镜仅 Alibi/Maestro/Azami 可用',
        underbarrel: false, mobility: 50,
        reloadTactical: 3.0, reloadEmpty: 3.8,
        recoil: { vertical: 'high', horizontal: 'medium', pattern: '半自动独头弹，30发弹匣持续输出' },
        falloff: { start: 15, end: 25, min: 41 } // [GitHub实测Y11S1.1] 69→41 (Y9S4.2: 衰减15-25m, 最低60%)
    },
    'TCSG12': {
        sights: ['red_dot', 'holographic', 'reflex', 'magnified'],
        sightNote: '2.5x 放大镜仅 Goyo/Kaid 可用',
        underbarrel: false, mobility: 50,
        reloadTactical: 2.8, reloadEmpty: 3.5,
        recoil: { vertical: 'high', horizontal: 'low', pattern: '半自动独头弹，450RPM射速' },
        falloff: { start: 15, end: 25, min: 45 } // [GitHub实测Y11S1.1] 75→45 (Y9S4.2: 57→75buff, 衰减15-25m, 最低60%)
    },
    'Glaive-12': {
        sights: ['red_dot', 'holographic', 'reflex'],
        underbarrel: false, mobility: 50,
        reloadTactical: 3.0, reloadEmpty: 3.0,
        recoil: { vertical: 'high', horizontal: 'low', pattern: '独头霰弹枪' },
        falloff: { start: 15, end: 25, min: 40 } // 独头霰弹枪统一衰减: 15-25m, 最低60% → 67×0.6≈40
    },

    // === 副武器 - 霰弹枪 ===
    'ITA12S': {
        sights: [],
        underbarrel: false, mobility: 50,
        reloadTactical: 3.0, reloadEmpty: 3.0,
        recoil: { vertical: 'high', horizontal: 'low', pattern: '副武器泵动霰弹枪，用于破墙' },
        falloff: { start: 5, midStart: 7, mid: 21, midEnd: 10, end: 13, min: 13, pellets: 8 } // [GitHub实测Y11S1.1] 29→21→13
    },
    'Super Shorty': {
        sights: [],
        underbarrel: false, mobility: 50,
        reloadTactical: 2.5, reloadEmpty: 2.5,
        recoil: { vertical: 'very_high', horizontal: 'medium', pattern: '短管霰弹枪，散布极大，用于破墙' },
        falloff: { start: 5, midStart: 7, mid: 26, midEnd: 10, end: 13, min: 15, pellets: 8 } // [灰机wiki面板35×8 + 同类衰减模式推算] 35→26→15
    },

    // === 副武器 - 冲锋枪 ===
    'C75 Auto': {
        sights: [],
        underbarrel: false, mobility: 50,
        reloadTactical: 2.2, reloadEmpty: 2.8,
        recoil: { vertical: 'high', horizontal: 'high', pattern: '1000RPM射速，后坐力大且铁瞄遮挡严重' },
        falloff: { start: 18, end: 28, min: 21 }
    },
    'SMG-11': {
        sights: ['red_dot', 'holographic', 'reflex'],
        underbarrel: true, mobility: 50,
        reloadTactical: 1.8, reloadEmpty: 2.4,
        recoil: { vertical: 'very_high', horizontal: 'very_high', pattern: '极高后坐力，16发弹匣不到1秒清空' },
        falloff: { start: 18, end: 28, min: 19 },
        falloffExt: { start: 20, end: 28, min: 28 },
    },
    'SMG-12': {
        sights: ['red_dot', 'holographic', 'reflex'],
        underbarrel: false, mobility: 50,
        reloadTactical: 2.0, reloadEmpty: 2.6,
        recoil: { vertical: 'very_high', horizontal: 'very_high', pattern: '极高后坐力，全游戏最难控制武器之一' },
        falloff: { start: 17, end: 28, min: 9 } // [Y11S3 实测] 16→9 (17-28m)，40m 维持 9
    },
    'Bearing 9': {
        sights: ['red_dot', 'holographic', 'reflex'],
        underbarrel: false, mobility: 50,
        reloadTactical: 1.9, reloadEmpty: 2.5,
        recoil: { vertical: 'high', horizontal: 'high', pattern: '1100RPM高射速，后坐力大' },
        falloff: { start: 18, end: 28, min: 19 },
        falloffExt: { start: 21, end: 28, min: 29 },
    },
    'SPSMG9': {
        sights: ['red_dot', 'holographic', 'reflex'],
        underbarrel: false, mobility: 50,
        reloadTactical: 1.9, reloadEmpty: 2.5,
        recoil: { vertical: 'medium', horizontal: 'medium', pattern: '中等后坐力，副武器中较可控' },
        falloffExt: { start: 19, end: 28, min: 31 },
        falloff: { start: 17, end: 27, min: 21 } // [Y11S3 实测] 35→21 (17-27m),
    },
    'Reaper MK2': {
        sights: ['red_dot', 'holographic', 'reflex'],
        underbarrel: false, mobility: 50,
        reloadTactical: 2.0, reloadEmpty: 2.6,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: 'Y11S2.3优化：后坐力阶段延后至第0/3/10/25发（原0/3/7/13），连续射击更平稳，通用副武器SMG' },
        falloff: { start: 18, end: 28, min: 18 }
    },

    // === 副武器 - 手枪 (精选代表性) ===
    '5.7 USG': {
        sights: [], underbarrel: true, mobility: 50,
        reloadTactical: 1.6, reloadEmpty: 2.2,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '半自动手枪，后坐力小' },
        falloff: { start: 12, end: 14, min: 25 }
    },
    'P12': {
        sights: [], underbarrel: true, mobility: 50,
        reloadTactical: 1.6, reloadEmpty: 2.2,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '半自动手枪，标准后坐力' },
        falloff: { start: 12, end: 14, min: 26 }
    },
    'PMM': {
        sights: [], underbarrel: true, mobility: 50,
        reloadTactical: 1.5, reloadEmpty: 2.1,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '高伤害手枪，后坐力稍大' },
        falloff: { start: 12, end: 14, min: 36 }
    },
    'D-50': {
        sights: [], underbarrel: true, mobility: 50,
        reloadTactical: 1.8, reloadEmpty: 2.4,
        recoil: { vertical: 'very_high', horizontal: 'medium', pattern: '沙漠之鹰，极大后坐力' },
        falloff: { start: 12, end: 14, min: 42 }
    },
    'LFP586': {
        sights: [], underbarrel: false, mobility: 50,
        reloadTactical: 2.5, reloadEmpty: 2.5,
        recoil: { vertical: 'very_high', horizontal: 'medium', pattern: '左轮，单发后坐力极大' },
        falloff: { start: 12, end: 14, min: 46 }
    },
    'Keratos .357': {
        sights: [], underbarrel: false, mobility: 50,
        reloadTactical: 2.5, reloadEmpty: 2.5,
        recoil: { vertical: 'high', horizontal: 'low', pattern: '底部枪管设计降低上跳' },
        falloff: { start: 12, end: 14, min: 46 }
    },

    // === 2026-09-07 依 GitHub 实测补齐手枪/左轮衰减 ===
    '.44 Mag Semi-Auto': { falloff: { start: 12, end: 14, min: 32 } },
    '.44 Vendetta': { falloff: { start: 12, end: 14, min: 46 } },
    '1911 TACOPS': { falloff: { start: 12, end: 14, min: 33 } },
    'GSH-18': { falloff: { start: 12, end: 14, min: 26 } },
    'Luison': { falloff: { start: 12, end: 14, min: 39 } },
    'M45 MEUSOC': { falloff: { start: 12, end: 14, min: 34 } },
    'Mk1 9mm': { falloff: { start: 12, end: 14, min: 28 } },
    'P-10C': { falloff: { start: 12, end: 14, min: 24 } },
    'P226 MK 25': { falloff: { start: 12, end: 14, min: 30 } },
    'P229': { falloff: { start: 12, end: 14, min: 30 } },
    'P9': { falloff: { start: 12, end: 14, min: 27 } },
    'PRB92': { falloff: { start: 12, end: 14, min: 25 } },
    'Q-929': { falloff: { start: 12, end: 14, min: 36 } },
    'RG15': { falloff: { start: 12, end: 14, min: 22 } },
    'SDP 9mm': { falloff: { start: 12, end: 14, min: 28 } },
    'TACIT .45': { falloff: { start: 12, end: 14, min: 31 } },
    'USP40': { falloff: { start: 12, end: 14, min: 28 } },
};

// ---- 武器详细档案 ----
// 数据来源: Fandom Wiki / R6灰机Wiki / Ubisoft官方
const WEAPON_DETAILS = {
    // ===== 突击步枪 =====
    'M4': {
        realName: 'Colt M4A1 Block II',
        caliber: '5.56x45mm NATO',
        country: '🇺🇸 美国',
        manufacturer: 'Colt',
        trivia: [
            '游戏内模型为 M4A1 Block II，采用 SOPMOD II 计划的 Daniel Defense RIS II Mk18 护木和 12.5 英寸枪管。',
            '配件细节充满 Maverick 的战地个性：消音器包布减少热气，弹匣底部绑绳圈充当土制 Ranger Plate。',
            '从护木前方看进去，游戏中的 M4 没有导气系统——被玩家戏称为"魔法驱动"。'
        ]
    },
    'Commando 9': {
        realName: 'Colt 9mm SMG (RO635 系列)',
        caliber: '9x19mm Parabellum',
        country: '🇺🇸 美国',
        manufacturer: 'Colt',
        trivia: [
            '原型为柯尔特 9mm 冲锋枪系列（9mm AR Commando），游戏建模融合了 RO639 的照门和 RO635 的快慢机等多个型号特征。',
            '虽然归类为突击步枪但发射 9mm 手枪弹，Y8S4 前一直错误地套用冲锋枪的伤害衰减。',
            '现实中柯尔特冲锋枪弹匣只有 20 发和 32 发两种规格，游戏中的 25 发弹匣并不存在。'
        ]
    },
    'L85A2': {
        realName: 'SA80 L85A2',
        caliber: '5.56x45mm NATO',
        country: '🇬🇧 英国',
        manufacturer: 'Royal Small Arms Factory / H&K',
        trivia: [
            '原型 L85A1 因可靠性问题臭名昭著（故障率极高），后由 H&K 德国公司全面翻新为 A2 版本。',
            '这是英国军队的标准制式步枪，采用犊牛式布局，弹匣在扳机后方。',
            'Sledge 和 Thatcher 均来自英国 SAS，与该武器的英军背景一致。'
        ]
    },
    'AR33': {
        realName: 'H&K HK33',
        caliber: '5.56x45mm NATO',
        country: '🇩🇪 德国',
        manufacturer: 'Heckler & Koch',
        trivia: [
            'HK33 是 G3 步枪的 5.56mm 版本，采用相同的滚柱延迟闭锁机构。',
            '是 Thatcher 的备选步枪，现实中 SAS 并不常规使用此武器。'
        ]
    },
    'G36C': {
        realName: 'H&K G36C',
        caliber: '5.56x45mm NATO',
        country: '🇩🇪 德国',
        manufacturer: 'Heckler & Koch',
        trivia: [
            'G36C 是 G36 突击步枪的紧凑版本，"C"代表 Compact。缩短的枪管和折叠枪托使其适合 CQB。',
            '现实中被德国 GSG-9、西班牙 GEO 和多个北约特种部队使用。'
        ]
    },
    'R4-C': {
        realName: 'Remington R4 Compact',
        caliber: '5.56x45mm NATO',
        country: '🇺🇸 美国',
        manufacturer: 'Remington Arms',
        trivia: [
            'R4-C 的"C"代表 Compact，是雷明顿 R4 系列的短枪管版本，配备 7 英寸（177.8mm）枪管。',
            '雷明顿 2012 年获得美军合同后生产 R4，但因与柯尔特的法律纠纷，美军转向 FN 采购，R4 随后转入民用和执法市场。',
            '游戏中配有 Magpul MOE® 握把、CTR® 枪托和雷明顿 RAHG 四面导轨护木。'
        ]
    },
    '556XI': {
        realName: 'SIG Sauer 556xi',
        caliber: '5.56x45mm NATO',
        country: '🇨🇭 瑞士 / 🇺🇸 美国',
        manufacturer: 'SIG Sauer',
        trivia: [
            'SIG 556xi 是一种模块化步枪，可以通过更换枪管和弹匣适配器切换口径（5.56mm / 7.62x39mm / .300 BLK）。',
            '"xi"代表该系列的最新迭代版本，修复了早期 SIG 556 的一些可靠性问题。'
        ]
    },
    'F2': {
        realName: 'FAMAS F1/G2',
        caliber: '5.56x45mm NATO',
        country: '🇫🇷 法国',
        manufacturer: 'GIAT Industries (Nexter)',
        trivia: [
            'FAMAS 绰号"Le Clairon"（军号），是法国军队的标准制式步枪（已被 HK416F 替代）。',
            '以 980 RPM 的超高射速著称，是游戏中射速最高的突击步枪之一，理论 DPS 极高。',
            '采用独特的杠杆延迟闭锁系统，在军用步枪中非常少见。'
        ]
    },
    'AK-12': {
        realName: 'AK-12 (2012 原型版)',
        caliber: '5.45x39mm',
        country: '🇷🇺 俄罗斯',
        manufacturer: 'Izhmash (卡拉什尼科夫集团)',
        trivia: [
            '游戏中的 AK-12 严格基于 2012 年"雷特尼克"竞标原型，与 2016 年俄军列装的量产版（AK-400/6P70）完全不同。',
            '2012 原型版特征：全长度顶部导轨、旋钮式快慢机（取代传统 AK 大拨片）、可拆式枪机拉柄和四段可调枪托。',
            '该原型因零组件强度不足和可靠性问题在测试中失败，最终被放弃，项目回归传统 AK 设计。'
        ]
    },
    'AUG A2': {
        realName: 'Steyr AUG A2',
        caliber: '5.56x45mm NATO',
        country: '🇦🇹 奥地利',
        manufacturer: 'Steyr Mannlicher',
        trivia: [
            'AUG（Armee-Universal-Gewehr，"军队通用步枪"）在竞标中击败 FN FAL、FN CAL、Vz58 和 M16，凭精度、重量和可靠性全面胜出。',
            'A2 版本将 A1 一体式 1.5 倍镜座改为销针固定的可拆卸式，允许更换不同镜座和皮卡汀尼导轨。',
            '游戏中的枪管长度介于全尺寸和 AUG-P 短枪管之间，属于游戏化调整。'
        ]
    },
    '552 Commando': {
        realName: 'SIG SG 552 Commando',
        caliber: '5.56x45mm NATO',
        country: '🇨🇭 瑞士',
        manufacturer: 'SIG Sauer (Swiss Arms)',
        trivia: [
            'SG 552 是 SG 550 突击步枪的紧凑卡宾版本，枪管长度从 528mm 缩短至 226mm。',
            '在多个特种部队中服役，因其在紧凑尺寸下依然保持的高精度而受到好评。'
        ]
    },
    '416-C CARBINE': {
        realName: 'H&K HK416C',
        caliber: '5.56x45mm NATO',
        country: '🇩🇪 德国',
        manufacturer: 'Heckler & Koch',
        trivia: [
            'HK416C 的研发源于 2001 年三角洲部队需求：用 H&K G36 的短行程活塞系统替换 M4 的直接导气，解决可靠性问题。',
            '约 2009 年公开，为响应英国 SAS 对紧凑短突击步枪的需求。9 英寸短枪管搭配类似 MP5A3 的滑管式折叠枪托，折叠后极为紧凑。',
            '机瞄瞄准时，后照门和前准星组成类似"●ω●"的颜文字表情，被玩家认为十分可爱。'
        ]
    },
    'C8-SFW': {
        realName: 'Colt Canada C8 SFW',
        caliber: '5.56x45mm NATO',
        country: '🇨🇦 加拿大',
        manufacturer: 'Colt Canada (前 Diemaco)',
        trivia: [
            'C8 SFW（Special Forces Weapon）基于 C8 卡宾枪（M725），配有改进的 400mm 重型枪管和 RIS 导轨护木。',
            '游戏建模实际上更接近柯尔特 933 型（11.5 英寸枪管），而非 C8-SFW 标志性的 16 英寸重型枪管。',
            'Buck 无法使用握把配件，因为下挂的 Skeleton Key（M26 MASS 霰弹枪模块）占用了握把导轨。'
        ]
    },
    'Mk17 CQB': {
        realName: 'FN SCAR-H CQC',
        caliber: '7.62x51mm NATO',
        country: '🇧🇪 比利时',
        manufacturer: 'FN Herstal',
        trivia: [
            'SCAR-H（Heavy）发射 7.62mm 全威力步枪弹，CQC 版本采用缩短枪管以适应近距离作战。',
            '高伤害低射速的特性反映了 7.62mm 的大口径子弹特点。',
            '现实中主要装备美军特种作战司令部（USSOCOM）。'
        ]
    },
    'PARA-308': {
        realName: 'IMBEL PARAFAL (FAL 现代化改型)',
        caliber: '7.62x51mm NATO',
        country: '🇧🇷 巴西 / 🇧🇪 比利时',
        manufacturer: 'IMBEL / FN Herstal',
        trivia: [
            '原型为巴西 IMBEL 对已服役 30+ 年 FAL 步枪的现代化改装（PARAFAL/MD-97L），包括短枪管、聚合物部件和导轨。',
            '游戏建模融合了 DSA SA58 OSW 的上机匣和旧式 FAL 的下机匣，弹匣形似 DSA 25 发弹匣但游戏设定为 30 发。',
            'Capitão 作为巴西 BOPE 成员使用此武器非常契合——巴西军警大量使用 FAL 系列。'
        ]
    },
    'Type-89': {
        realName: '89式 5.56mm 小銃',
        caliber: '5.56x45mm NATO',
        country: '🇯🇵 日本',
        manufacturer: '豊和工業 (Howa)',
        trivia: [
            '89 式步枪是日本自卫队的现役制式步枪，由丰和工业制造。仅 20 发弹匣是游戏平衡考虑。',
            '由于日本武器出口限制，89 式几乎不可能在日本以外见到，使其成为游戏中最"稀有"的真实武器之一。'
        ]
    },
    'C7E': {
        realName: 'Colt Canada C7NLD (荷兰定制版)',
        caliber: '5.56x45mm NATO',
        country: '🇨🇦 加拿大 / 🇳🇱 荷兰',
        manufacturer: 'Colt Canada',
        trivia: [
            'C7E 实际是荷兰订购的 C7A1 改型（C7NLD），装备 Magpul PRS 精密步枪枪托和四轨前护木。',
            '配备 20 英寸长枪管，游戏模型非常长，被玩家戏称为"西班牙长矛"。',
            '现实中 GEO（西班牙特种作战小组）并未装备 AR15 系列步枪，这是育碧的艺术加工。'
        ]
    },
    'M762': {
        realName: 'FB Beryl M762',
        caliber: '7.62x39mm M43',
        country: '🇵🇱 波兰',
        manufacturer: 'FB Radom',
        trivia: [
            'Beryl 是波兰基于 AK 平台自主研发的突击步枪，名字来源于绿宝石矿物 Beryl。',
            'M762 是出口型号，发射 7.62x39mm 弹药，而波兰军队标准型号发射 5.56mm NATO。',
            'Zofia 作为波兰 GROM 成员使用此武器完美契合背景设定。'
        ]
    },
    'V308': {
        realName: 'KRISS Vector (虚构改型)',
        caliber: '7.62x51mm NATO (游戏设定)',
        country: '🇺🇸 美国',
        manufacturer: 'KRISS USA (虚构版)',
        trivia: [
            'V308 是游戏虚构武器——现实中不存在 7.62mm NATO 口径的 KRISS Vector。',
            '50 发弹匣 + 全威力步枪弹的组合在现实中会导致武器过重、后坐力难以控制。',
            '名字中的"V"来自 Vector，"308"指 .308 Winchester（7.62x51mm 的民用名称）。'
        ]
    },
    'Spear .308': {
        realName: 'SIG MCX Spear',
        caliber: '.277 SIG Fury / 7.62x51mm (游戏设定 .308)',
        country: '🇺🇸 美国',
        manufacturer: 'SIG Sauer',
        trivia: [
            '现实中 SIG MCX Spear 赢得了美军 NGSW（Next Generation Squad Weapon）竞标，被命名为 XM7。',
            '原型设计使用全新的 .277 SIG Fury 弹药（6.8x51mm），具有比传统 5.56mm 更远的有效射程和更强的穿甲能力。',
            '游戏中命名为".308"是简化处理——实际口径设定并不完全准确。'
        ]
    },
    'AR-15.50': {
        realName: 'Beowulf AR-15 (.50 Beowulf)',
        caliber: '.50 Beowulf',
        country: '🇺🇸 美国',
        manufacturer: 'Alexander Arms',
        trivia: [
            '.50 Beowulf 是一种大口径 AR-15 平台弹药，专为近距离高停止力设计。',
            '10 发弹匣和半自动模式反映了大口径弹药的实际限制——后坐力太大不适合全自动。',
            '62 点基础伤害是突击步枪中最高的。'
        ]
    },
    'AK-74M': {
        realName: 'AK-74M',
        caliber: '5.45x39mm',
        country: '🇷🇺 俄罗斯',
        manufacturer: 'Kalashnikov Concern',
        trivia: [
            'AK-74M 是 AK-74 的现代化版本，"M"代表 Modernized。采用聚合物折叠枪托和导轨系统。',
            'Y11S2 新增全部握把选项（垂直/转角/水平），此前曾无握把槽作为平衡手段（对应40发大弹匣）。'
        ]
    },
    'ARX200': {
        realName: 'Beretta ARX200',
        caliber: '7.62x51mm NATO',
        country: '🇮🇹 意大利',
        manufacturer: 'Beretta',
        trivia: [
            'ARX200 是 ARX160 的放大版本，发射 7.62mm NATO 弹药，设计为班用自动武器/精确射手角色。',
            '具有模块化设计，可快速更换枪管组件以适应不同战术需求。'
        ]
    },
    'F90': {
        realName: 'Thales F90',
        caliber: '5.56x45mm NATO',
        country: '🇦🇺 澳大利亚',
        manufacturer: 'Thales Australia',
        trivia: [
            'F90 是 Steyr AUG 的澳大利亚现代化版本，由 Thales 澳大利亚分公司开发。',
            '2016 年被澳大利亚国防军选为 F88 Austeyr 的替代品，是该国最新的制式步枪。',
            'Gridlock 作为 SASR（澳大利亚特种空勤团）成员使用此武器完全合理。'
        ]
    },
    'SC3000K': {
        realName: 'FN F2000 Tactical',
        caliber: '5.56x45mm NATO (现实) / .300 BLK (游戏设定)',
        country: '🇧🇪 比利时',
        manufacturer: 'FN Herstal',
        trivia: [
            '名称来自育碧《细胞分裂》系列中 Sam Fisher 使用的 SC3000 步枪，现实原型为 FN F2000 Tactical（取消原厂光学瞄准镜版）。',
            'F2000 最独特的设计是"前抛壳"系统——空弹壳通过枪管上方的抛壳管从前方排出，左撇子也能使用。',
            '游戏中进行了大量魔改：口径改为 .300 BLK、枪托和弹匣井形状修改、拉机柄改为 AUG 式固定设计。'
        ]
    },
    'POF-9': {
        realName: 'POF-9 (Pakistan Ordnance Factories)',
        caliber: '9x19mm Parabellum',
        country: '🇵🇰 巴基斯坦',
        manufacturer: 'Pakistan Ordnance Factories',
        trivia: [
            'POF-9 是巴基斯坦军工厂生产的冲锋枪/卡宾枪，虽然归类为突击步枪但发射 9mm 弹药。',
            '是 Sens 的主武器，37 伤害的低数值反映了 9mm 口径的特性。'
        ]
    },
    'PCX-33': {
        realName: '虚构武器',
        caliber: '9x19mm Parabellum (推测)',
        country: '🇨🇴 哥伦比亚 (设定)',
        manufacturer: '虚构',
        trivia: [
            'PCX-33 没有明确的现实原型，外观融合了多种现代冲锋枪/卡宾枪的设计元素。',
            '作为 Solis 的武器引入，Solis 来自哥伦比亚。'
        ]
    },
    'XK23': {
        realName: '虚构武器 (无托式突击步枪)',
        caliber: null,
        country: null,
        manufacturer: '虚构',
        trivia: [
            'XK23 是 Y11S2 Operation System Override 新增的突击步枪，采用无托布局。',
            '该武器是少数可装备加长枪管的突击步枪，装备后伤害从 49 提升至 54。',
            '分配给 Dokkaebi、Rauora、Sens 三名进攻方干员。'
        ]
    },

    // ===== 冲锋枪 =====
    'FMG-9': {
        realName: 'Magpul FMG-9',
        caliber: '9x19mm Parabellum',
        country: '🇺🇸 美国',
        manufacturer: 'Magpul Industries',
        trivia: [
            'FMG-9（Folding Machine Gun-9）可以折叠成一个类似手电筒的长方体，展开后成为功能完整的冲锋枪。',
            '该武器是概念原型，从未量产。基于 Glock 18 机匣，使用 Glock 弹匣。'
        ]
    },
    'MP5K': {
        realName: 'H&K MP5K',
        caliber: '9x19mm Parabellum',
        country: '🇩🇪 德国',
        manufacturer: 'Heckler & Koch',
        trivia: [
            'MP5K（K = Kurz，德语"短"）是 MP5 的超紧凑版本，枪管仅 115mm。',
            '专为 VIP 保护和隐蔽携带设计，可以放入公文包射击（配合特殊公文包装置）。'
        ]
    },
    'UMP45': {
        realName: 'H&K UMP45',
        caliber: '.45 ACP',
        country: '🇩🇪 德国',
        manufacturer: 'Heckler & Koch',
        trivia: [
            'UMP（Universal Machine Pistol）是 MP5 的低成本继任者，大量使用聚合物材料降低成本和重量。',
            '.45 ACP 弹药使其拥有较高的单发伤害（38）但射速较低（600 RPM），与现实特性一致。'
        ]
    },
    'MP5': {
        realName: 'H&K MP5A5 (2014 现代化版)',
        caliber: '9x19mm Parabellum',
        country: '🇩🇪 德国',
        manufacturer: 'Heckler & Koch',
        trivia: [
            '游戏内型号为 2014 SHOT SHOW 上推出的沙黄色现代化 MP5A5，带三面导轨护木和 MP5F 加厚橡胶底板枪托。',
            '1977 年摩加迪沙劫机事件和 1980 年伊朗大使馆人质事件中，GSG-9 和 SAS 使用 MP5 的画面让这把枪一夜成名。',
            '采用独特的滚柱延迟闭锁系统（源自 G3/CETME），射击精度远超同类吹回式冲锋枪。'
        ]
    },
    'P90': {
        realName: 'FN P90',
        caliber: '5.7x28mm',
        country: '🇧🇪 比利时',
        manufacturer: 'FN Herstal',
        trivia: [
            'P90 采用革命性的顶部水平弹匣设计，50 发弹匣水平放置在枪身上方。',
            '5.7x28mm 弹药专为穿透软质护甲设计，这也是 NATO 要求开发此弹药的原因。',
            '因其未来感的外形在科幻影视中大量出镜，最著名的是《星际之门》系列。'
        ]
    },
    'MP5SD': {
        realName: 'H&K MP5SD',
        caliber: '9x19mm Parabellum',
        country: '🇩🇪 德国',
        manufacturer: 'Heckler & Koch',
        trivia: [
            'MP5SD 的"SD"代表 Schalldämpfer（德语"消音器"），拥有一体化消音枪管。',
            '枪管上有30个小孔将火药气体导入消音器罩，同时将弹头减速至亚音速，无需使用亚音速弹药。',
            '游戏中无法更换枪管配件是因为消音器是枪管的一部分，不可拆卸。'
        ]
    },
    '9x19VSN': {
        realName: 'PP-19-01 Vityaz-SN',
        caliber: '9x19mm Parabellum',
        country: '🇷🇺 俄罗斯',
        manufacturer: 'Kalashnikov Concern',
        trivia: [
            'Vityaz-SN 基于 AK 平台改造为发射 9mm 弹药的冲锋枪，保留了 AK 标志性的操作方式。',
            '"Vityaz"在俄语中意为"勇士"，该武器被俄罗斯 FSB、MVD 等多个安全部队使用。'
        ]
    },
    'MP7': {
        realName: 'H&K MP7A1',
        caliber: '4.6x30mm',
        country: '🇩🇪 德国',
        manufacturer: 'Heckler & Koch',
        trivia: [
            'MP7 开发目的是在紧凑尺寸下提供穿透 NATO CRISAT 标准护甲的能力。',
            '4.6x30mm 弹药是 H&K 对 FN 5.7x28mm 的竞争回应，两种弹药在穿甲测试中互有胜负。',
            '折叠后仅 415mm 长（比很多手枪加消音器还短），非常适合隐蔽携带。'
        ]
    },
    '9mm C1': {
        realName: 'Sterling L2A3 (加拿大版)',
        caliber: '9x19mm Parabellum',
        country: '🇨🇦 加拿大 / 🇬🇧 英国',
        manufacturer: 'Sterling Armaments',
        trivia: [
            'C1 是加拿大版的 Sterling 冲锋枪，从 1953 年一直服役到 1990 年代。',
            'Sterling 以其侧面插入的弧形弹匣和高可靠性著称，在包括马尔维纳斯/福克兰群岛战争中实战使用。'
        ]
    },
    'MPX': {
        realName: 'SIG Sauer MPX',
        caliber: '9x19mm Parabellum',
        country: '🇺🇸 美国',
        manufacturer: 'SIG Sauer',
        trivia: [
            'MPX 采用短行程活塞系统（而非传统冲锋枪的反冲式），可靠性更高、射击更平稳。',
            '26 点的低伤害使其在数据上不太吸引人，但极低的后坐力让它成为一把"激光枪"。'
        ]
    },
    'M12': {
        realName: 'Beretta M12',
        caliber: '9x19mm Parabellum',
        country: '🇮🇹 意大利',
        manufacturer: 'Beretta',
        trivia: [
            'Beretta M12 是 1958 年设计的冲锋枪，采用包络式枪机设计以缩短全枪长度。',
            '曾被意大利军队、巴西军警以及多个国家的安全部队使用。',
            'Caveira 作为巴西 BOPE 成员使用此武器——巴西确实大量进口了 M12。'
        ]
    },
    'PDW9': {
        realName: '虚构武器 (类似 SIG MPX/LWRC SMG-45)',
        caliber: '9x19mm Parabellum',
        country: '🇪🇸 西班牙 (设定)',
        manufacturer: '虚构',
        trivia: [
            'PDW9 没有明确的现实原型，外观融合了多种现代 PDW 设计。',
            '50 发大弹匣使其成为进攻方的持续火力选项。'
        ]
    },
    'Vector .45': {
        realName: 'KRISS Vector Gen II',
        caliber: '.45 ACP',
        country: '🇺🇸 美国',
        manufacturer: 'KRISS USA',
        trivia: [
            'KRISS Vector 采用革命性的"Super V"系统，将后坐力向下方重新引导，大幅降低射击时的枪口上跳。',
            '1200 RPM 的极高射速是游戏中冲锋枪之最，反映了 Vector 实际的高射速能力。',
            '25 发弹匣配 1200 RPM 意味着一秒钟就能清空弹匣。'
        ]
    },
    'T-5 SMG': {
        realName: '虚构武器 (类似 JS 9mm)',
        caliber: '9x19mm Parabellum',
        country: '🇨🇳 中国 (设定)',
        manufacturer: '虚构',
        trivia: [
            '游戏中的 T-5 SMG 外观类似中国 JS 9mm 冲锋枪，但名称和具体设计为虚构。',
            '900 RPM 的高射速配合适中的后坐力，使其成为防守方热门选择。'
        ]
    },
    'Scorpion EVO': {
        realName: 'CZ Scorpion EVO 3 A1',
        caliber: '9x19mm Parabellum',
        country: '🇨🇿 捷克',
        manufacturer: 'CZ (Česká zbrojovka)',
        trivia: [
            'EVO 3 A1 是全新设计，与经典的 Vz.61 蝎式冲锋枪除了名字外没有关系。',
            '1080 RPM 超高射速配 40 发弹匣，数据上非常凶猛，但后坐力是游戏中最难控制的之一。',
            'Ela 是波兰 GROM 干员，现实中捷克 EVO 确实出口到了波兰。'
        ]
    },
    'K1A': {
        realName: 'Daewoo K1A',
        caliber: '5.56x45mm NATO',
        country: '🇰🇷 韩国',
        manufacturer: 'S&T Motiv (前大宇精密)',
        trivia: [
            'K1A 在韩国被归类为冲锋枪（SMG），但实际发射 5.56mm 步枪弹——这种分类在全球是独特的。',
            '是韩国特种部队和军官的标准武器，在游戏中分配给韩国 707 特殊任务营的 Vigil。'
        ]
    },
    'Mx4 Storm': {
        realName: 'Beretta Mx4 Storm',
        caliber: '9x19mm Parabellum',
        country: '🇮🇹 意大利',
        manufacturer: 'Beretta',
        trivia: [
            'Mx4 Storm 是 Cx4 Storm 民用卡宾枪的军用/执法全自动版本。',
            '可与 Beretta Px4 Storm 手枪共用弹匣，体现了 Beretta Storm 系列的模块化理念。'
        ]
    },
    'AUG A3': {
        realName: 'Steyr AUG A3 SMG',
        caliber: '9x19mm Parabellum',
        country: '🇦🇹 奥地利',
        manufacturer: 'Steyr Mannlicher',
        trivia: [
            'AUG 系列的模块化设计允许通过更换枪管组件将步枪转换为 9mm 冲锋枪。',
            'A3 版本增加了标准皮卡汀尼导轨，取代了早期型号的内置光学瞄准具。'
        ]
    },
    'P10 RONI': {
        realName: 'CAA RONI Kit + CZ P-10 C',
        caliber: '9x19mm Parabellum',
        country: '🇮🇱 以色列 / 🇨🇿 捷克',
        manufacturer: 'CAA Industries / CZ',
        trivia: [
            '与 Commando 9 类似，P10 RONI 也是将手枪（CZ P-10 C）装入 RONI 套件转换为卡宾枪。',
            '15 发的小弹匣是其最大弱点，反映了底层仍是手枪弹匣的限制。'
        ]
    },
    'UZK50GI': {
        realName: '虚构武器 (类似 UZI PRO)',
        caliber: '.50 GI (游戏设定)',
        country: '🇮🇪 爱尔兰 (设定)',
        manufacturer: '虚构',
        trivia: [
            '外观类似以色列 UZI PRO，但名称和口径（.50 GI）为游戏虚构。',
            '.50 GI 在现实中确实存在——是一种将 .45 ACP 口径放大到 .50 的手枪弹。'
        ]
    },

    // ===== 轻机枪 =====
    'M249': {
        realName: 'FN M249 SAW',
        caliber: '5.56x45mm NATO',
        country: '🇧🇪 比利时 / 🇺🇸 美国',
        manufacturer: 'FN Herstal',
        trivia: [
            'M249 SAW（Squad Automatic Weapon）是美军标准班组自动武器，基于 FN Minimi 设计。',
            '100 发弹链箱是其标准配置，可提供持续的压制火力。',
            '游戏中 48 伤害 + 100 发弹匣的组合使其成为强力的区域封锁武器。'
        ]
    },
    '6P41': {
        realName: 'RPK-16',
        caliber: '5.45x39mm',
        country: '🇷🇺 俄罗斯',
        manufacturer: 'Kalashnikov Concern',
        trivia: [
            '6P41 是 RPK-16 的俄军 GRAU 编号。RPK-16 是基于 AK-12 平台的现代化轻机枪。',
            '可以使用标准 AK 弹匣或 96 发弹鼓，游戏中的 100 发设定接近弹鼓容量。'
        ]
    },
    'G8A1': {
        realName: 'H&K HK21 / G8',
        caliber: '7.62x51mm NATO (原型) / 5.56mm (游戏)',
        country: '🇩🇪 德国',
        manufacturer: 'Heckler & Koch',
        trivia: [
            'G8A1 基于 HK21 通用机枪的轻量化版本，采用 HK 标志性的滚柱延迟闭锁系统。',
            '游戏中 850 RPM 的高射速使其成为最具攻击性的轻机枪，适合积极推进的玩法。'
        ]
    },
    'T-95 LSW': {
        realName: '95 式班用机枪 (QJB-95)',
        caliber: '5.8x42mm DBP-87',
        country: '🇨🇳 中国',
        manufacturer: '中国兵器工业集团',
        trivia: [
            'QJB-95 是 95 式自动步枪的班用机枪版本，配有重枪管和弹鼓。',
            '发射中国自主研发的 5.8x42mm 弹药，这种口径不属于任何 NATO 或华约标准。',
            '犊牛式布局使其在同类武器中长度最短，适合室内作战。'
        ]
    },
    'LMG-E': {
        realName: 'FN Minimi（机枪版）',
        caliber: '5.56x45mm NATO',
        country: '🇧🇪 比利时',
        manufacturer: 'FN Herstal',
        trivia: [
            '游戏内的 LMG-E 外观非常接近 FN Minimi Mk3 或其出口型号。',
            '150 发的巨大弹匣容量使其成为游戏中弹药最多的自动武器之一。'
        ]
    },
    'ALDA 5.56': {
        realName: 'Beretta ARX200 LMG (虚构衍生)',
        caliber: '5.56x45mm NATO',
        country: '🇮🇹 意大利',
        manufacturer: 'Beretta',
        trivia: [
            '游戏中的 ALDA 5.56 没有精确对应的现实原型，可能基于 Beretta 的轻武器概念。',
            '900 RPM 是 LMG 类别中最高的射速，配合 80 发弹匣提供恐怖的持续火力。'
        ]
    },
    'M249 SAW': {
        realName: 'FN M249 SAW (短枪管版)',
        caliber: '5.56x45mm NATO',
        country: '🇧🇪 比利时 / 🇺🇸 美国',
        manufacturer: 'FN Herstal',
        trivia: [
            '与 Capitão 的 M249 不同，Gridlock 的 M249 SAW 使用短枪管配置和 60 发弹匣。',
            '较少的弹匣容量（60 vs 100）通过更灵活的操控性来平衡。'
        ]
    },
    'DP27': {
        realName: 'DP-27 (Degtyaryov)',
        caliber: '7.62x54mmR',
        country: '🇷🇺 俄罗斯/苏联',
        manufacturer: 'Degtyaryov Plant',
        trivia: [
            'DP-27 是二战时期苏联的标准轻机枪，1928 年列装，以极高的可靠性著称。',
            '其标志性的圆形弹盘（pan magazine）放在枪身上方，给人留下深刻印象。',
            '游戏中 Tachanka 使用这把"古董"级武器，呼应了他"Lord Tachanka"的 meme 形象和苏联军人设定。'
        ]
    },

    // ===== 狙击步枪 =====
    'CSRX 300': {
        realName: '定制直拉式栓动步枪 (无明确现实原型)',
        caliber: '.300 Winchester Magnum',
        country: '未知',
        manufacturer: '虚构 / 定制',
        trivia: [
            '官方描述为"定制直拉式栓动步枪"，采用直拉枪机操作而非传统的旋转后拉式，在游戏中独一无二。',
            '自带不可拆卸的 5x/12x 双倍率瞄准镜，可穿透软墙留下大洞、一击摧毁封阻板、击退所有防弹护盾。',
            '射击后弹道轨迹可见 1 秒（57 米长），所有玩家可见，因此连续射击会暴露位置。'
        ]
    },

    // ===== 射手步枪 =====
    '417': {
        realName: 'H&K HK417',
        caliber: '7.62x51mm NATO',
        country: '🇩🇪 德国',
        manufacturer: 'Heckler & Koch',
        trivia: [
            'HK417 是 HK416 的 7.62mm 版本，定位为精确射手步枪。采用相同的短行程活塞系统。',
            '被法国军队选为 Fusil à Tir de Précision（精确射击步枪），与游戏中分配给法国干员一致。'
        ]
    },
    'OTs-03': {
        realName: 'SVU-AS (OTs-03)',
        caliber: '7.62x54mmR',
        country: '🇷🇺 俄罗斯',
        manufacturer: 'TsKIB SOO',
        trivia: [
            'SVU 是 SVD 狙击步枪的犊牛式改型，大幅缩短了全枪长度以适应城市作战。',
            '"OTs-03"是该武器的设计局编号，AS 后缀表示可全自动射击（游戏中未体现）。',
            'Glaz 作为 Spetsnaz 狙击手使用此武器非常契合。'
        ]
    },
    'CAMRS': {
        realName: 'Colt Canada C20 (CAMRS)',
        caliber: '7.62x51mm NATO',
        country: '🇨🇦 加拿大',
        manufacturer: 'Colt Canada',
        trivia: [
            'CAMRS（Canadian Army Marksman Rifle System）是加拿大军队的精确射手步枪。',
            '基于 AR-10 平台，与 SR-25 有很多共同点。'
        ]
    },
    'SR-25': {
        realName: 'KAC SR-25 / M110 SASS',
        caliber: '7.62x51mm NATO',
        country: '🇺🇸 美国',
        manufacturer: 'Knight\'s Armament Company',
        trivia: [
            'SR-25 被美军采用为 M110 SASS（Semi-Automatic Sniper System）。',
            '20 发弹匣比大多数 DMR 的 10 发大一倍，提供了更好的持续火力。'
        ]
    },
    'Mk 14 EBR': {
        realName: 'Mk 14 Enhanced Battle Rifle',
        caliber: '7.62x51mm NATO',
        country: '🇺🇸 美国',
        manufacturer: 'Smith Enterprise / Sage International',
        trivia: [
            'Mk 14 EBR 是经典 M14 步枪的现代化改造版，安装了新的可折叠枪托和皮卡汀尼导轨。',
            '在阿富汗和伊拉克战场上因其远距离精度和 7.62mm 的停止力而受到特种部队青睐。'
        ]
    },
    'PMR90A2': {
        realName: '虚构武器',
        caliber: '7.62x51mm NATO (推测)',
        country: '未知',
        manufacturer: '虚构',
        trivia: [
            'Y11S1 新增的射手步枪，分配给 Thatcher、Capitão、Nøkk 和 Solid Snake。',
            '没有明确的现实原型，名称中的 PMR 可能暗示"Precision Marksman Rifle"。'
        ]
    },

    // ===== 霰弹枪 =====
    'M870': {
        realName: 'Remington 870',
        caliber: '12 Gauge',
        country: '🇺🇸 美国',
        manufacturer: 'Remington Arms',
        trivia: [
            'Remington 870 是历史上产量最大的泵动霰弹枪之一，累计生产超过 1100 万支。',
            '被全球无数军队、警察和民用市场使用，是泵动霰弹枪的标杆产品。'
        ]
    },
    'M590A1': {
        realName: 'Mossberg 590A1',
        caliber: '12 Gauge',
        country: '🇺🇸 美国',
        manufacturer: 'O.F. Mossberg & Sons',
        trivia: [
            'M590A1 是唯一通过美军 MIL-S-3443 标准测试的泵动霰弹枪。',
            '与 Remington 870 的竞争是霰弹枪界的"可口可乐 vs 百事可乐"。SAS 两把霰弹枪都有。'
        ]
    },
    'M1014': {
        realName: 'Benelli M4 Super 90 (M1014)',
        caliber: '12 Gauge',
        country: '🇮🇹 意大利',
        manufacturer: 'Benelli Armi',
        trivia: [
            'M1014 是 Benelli M4 的美军编号，是一款半自动战术霰弹枪。',
            '采用独特的 ARGO（Auto Regulating Gas Operated）导气系统，极其可靠。'
        ]
    },
    'SG-CQB': {
        realName: 'Remington 870 CQB',
        caliber: '12 Gauge',
        country: '🇺🇸 美国',
        manufacturer: 'Remington Arms',
        trivia: [
            '实际上是 870 的近距离作战特化版本，配有短枪管和战术配件。',
            '分配给法国 GIGN 的 Doc 和 Rook。'
        ]
    },
    'SASG-12': {
        realName: 'Saiga-12',
        caliber: '12 Gauge',
        country: '🇷🇺 俄罗斯',
        manufacturer: 'Kalashnikov Concern',
        trivia: [
            'Saiga-12 是基于 AK 平台的半自动霰弹枪，使用可拆卸弹匣供弹。',
            '是少数基于步枪平台设计的霰弹枪之一。'
        ]
    },
    'SUPER 90': {
        realName: 'Benelli M1 Super 90',
        caliber: '12 Gauge',
        country: '🇮🇹 意大利',
        manufacturer: 'Benelli Armi',
        trivia: [
            'Benelli M1 Super 90 是 M4 的前代产品，采用惯性闭锁系统（而非导气系统）。',
            '分配给加拿大 JTF2 的 Frost。'
        ]
    },
    'SPAS-12': {
        realName: 'Franchi SPAS-12',
        caliber: '12 Gauge',
        country: '🇮🇹 意大利',
        manufacturer: 'Luigi Franchi S.p.A.',
        trivia: [
            'SPAS-12 可在泵动和半自动模式之间切换，在影视作品中极其知名（《终结者》《侏罗纪公园》）。',
            '1994 年在美国被禁止进口，目前已停产，但因影视影响力保持着极高知名度。'
        ]
    },
    'SPAS-15': {
        realName: 'Franchi SPAS-15',
        caliber: '12 Gauge',
        country: '🇮🇹 意大利',
        manufacturer: 'Luigi Franchi S.p.A.',
        trivia: [
            'SPAS-15 是 SPAS-12 的改进型，最大的变化是采用可拆卸弹匣供弹替代管式弹仓。',
            '保留了泵动/半自动双模式切换的设计。'
        ]
    },
    'SuperNova': {
        realName: 'Benelli SuperNova',
        caliber: '12 Gauge',
        country: '🇮🇹 意大利',
        manufacturer: 'Benelli Armi',
        trivia: [
            'SuperNova 是 Benelli Nova 的改进版，采用 ComforTech 后坐力缓冲系统。',
            '游戏中它是少数可以装消音器的霰弹枪之一。'
        ]
    },
    'FO-12': {
        realName: 'Origin-12 (Foster Industries)',
        caliber: '12 Gauge',
        country: '🇺🇸 美国',
        manufacturer: 'Foster Industries',
        trivia: [
            'Origin-12 是一款全自动战术霰弹枪，可以极快的速度倾泻弹药。',
            '游戏中它是唯一的全自动主武器霰弹枪，10 发弹匣可以在瞬间清空。'
        ]
    },
    'SIX12': {
        realName: 'Crye Precision SIX12',
        caliber: '12 Gauge',
        country: '🇺🇸 美国',
        manufacturer: 'Crye Precision',
        trivia: [
            'SIX12 采用旋转弹仓（类似左轮手枪），可容纳 6 发霰弹。',
            '设计上可以作为独立武器或安装在 M4/M16 下挂使用。'
        ]
    },
    'SIX12 SD': {
        realName: 'Crye Precision SIX12 SD',
        caliber: '12 Gauge',
        country: '🇺🇸 美国',
        manufacturer: 'Crye Precision',
        trivia: [
            '带消音器的 SIX12 版本，SD = Suppressed。',
            '是游戏中唯一自带消音的霰弹枪，适合隐蔽破墙。'
        ]
    },
    'ITA12L': {
        realName: 'Fabarm SDASS (Long)',
        caliber: '12 Gauge',
        country: '🇮🇹 意大利',
        manufacturer: 'Fabarm',
        trivia: [
            'ITA12L 是 ITA12S 的长管版本，作为主武器使用。',
            '泵动霰弹枪，弹容量比短管版多3发。'
        ]
    },

    // ===== 独头霰弹枪 =====
    'BOSG.12.2': {
        realName: '虚构武器 (类似 TP-82)',
        caliber: '12 Gauge Slug',
        country: '🇰🇷 韩国 (设定)',
        manufacturer: '虚构',
        trivia: [
            'BOSG.12.2 是一把只有 2 发子弹的双管独头弹霰弹枪，125 伤害可一发爆头击杀。',
            '被社区戏称为"手持加农炮"——两发打空后就只剩下副武器可用。',
            '"BOSG"的名称来源不明，可能是"Breach, Overwatch, Support Gun"的缩写。'
        ]
    },
    'ACS12': {
        realName: 'Origin-12 (独头弹版)',
        caliber: '12 Gauge Slug',
        country: '🇺🇸 美国',
        manufacturer: 'Foster Industries',
        trivia: [
            'ACS12 与 FO-12 共享相同的平台（Origin-12），但配置为发射独头弹。',
            '30 发弹匣 + 半自动的独头弹组合使其可以像步枪一样使用。'
        ]
    },
    'TCSG12': {
        realName: '虚构武器',
        caliber: '12 Gauge Slug',
        country: '🇲🇦 摩洛哥 (设定)',
        manufacturer: '虚构',
        trivia: [
            'TCSG12 经历多次调整：84→57→63→75（Y9S4.2 buff至75）。',
            '可装消音器的独头弹霰弹枪，在远距离仍有不错的精度。'
        ]
    },
    'Glaive-12': {
        realName: '虚构武器',
        caliber: '12 Gauge Slug',
        country: '未知',
        manufacturer: '虚构',
        trivia: [
            'Denari 专属独头霰弹枪，4发弹容量。'
        ]
    },

    // ===== 副武器 - 冲锋枪 =====
    'C75 Auto': {
        realName: 'CZ 75 Automatic',
        caliber: '9x19mm Parabellum',
        country: '🇨🇿 捷克',
        manufacturer: 'CZ (Česká zbrojovka)',
        trivia: [
            'CZ 75 是世界上被仿制最多的手枪设计之一，全自动版本极其少见。',
            '1000 RPM 的射速使其在近距离极其致命，但铁瞄具阻挡严重是最大缺点。'
        ]
    },
    'SMG-11': {
        realName: 'MAC-11 (Ingram)',
        caliber: '.380 ACP (现实) / 9mm (游戏)',
        country: '🇺🇸 美国',
        manufacturer: 'Military Armament Corporation',
        trivia: [
            'MAC-11 是 MAC-10 的缩小版本，原版发射 .380 ACP 弹药。',
            '1270 RPM 的极端射速意味着 16 发弹匣不到一秒就能清空，控枪难度极高。',
            '是 SAS 干员的标志性副武器，也是游戏中技巧上限最高的武器之一。'
        ]
    },
    'SMG-12': {
        realName: 'Brügger & Thomet MP9',
        caliber: '9x19mm Parabellum',
        country: '🇨🇭 瑞士',
        manufacturer: 'B&T AG',
        trivia: [
            'B&T MP9 基于 Steyr TMP 发展而来，是一款极其紧凑的冲锋手枪。',
            '32 发弹匣比 SMG-11 大一倍，但后坐力同样难以控制。'
        ]
    },
    'Bearing 9': {
        realName: 'Minebea PM-9',
        caliber: '9x19mm Parabellum',
        country: '🇯🇵 日本',
        manufacturer: 'Minebea (现 MinebeaMitsumi)',
        trivia: [
            'PM-9 是日本自卫队的冲锋枪，外观非常紧凑。',
            '1100 RPM 的高射速使其成为副武器中的火力强手。'
        ]
    },
    'SPSMG9': {
        realName: 'B&T USW-G (推测)',
        caliber: '9x19mm Parabellum',
        country: '🇨🇭 瑞士',
        manufacturer: 'B&T AG',
        trivia: [
            '外观接近 B&T 的 Universal Service Weapon 概念，是一款紧凑的冲锋手枪。',
            '分配给 Kali 和 Clash 作为副武器。'
        ]
    },
    'Reaper MK2': {
        realName: '虚构武器',
        caliber: '9x19mm Parabellum (推测)',
        country: '未知',
        manufacturer: '虚构',
        trivia: [
            'Y10S3 引入并大量分配给多个干员（Oryx、Pulse、Rook、Sledge、Ying 等）。',
            '作为通用副武器冲锋枪，提供中等但可控的火力输出。'
        ]
    },

    // ===== 副武器 - 手枪精选 =====
    'D-50': {
        realName: 'IMI Desert Eagle .50 AE',
        caliber: '.50 Action Express',
        country: '🇮🇱 以色列 / 🇺🇸 美国',
        manufacturer: 'IMI / Magnum Research',
        trivia: [
            '沙漠之鹰是影视作品中最知名的大口径手枪，.50 AE 版本的后坐力巨大。',
            '71 点伤害是手枪类别中最高之一，两枪就能击杀满血敌人。'
        ]
    },
    'PMM': {
        realName: 'PM Makarov (PMM)',
        caliber: '9x18mm Makarov',
        country: '🇷🇺 俄罗斯',
        manufacturer: 'Izhevsk Mechanical Plant',
        trivia: [
            'PMM 是 PM 马卡洛夫手枪的现代化版本，通过增加膛室压力提高了弹道性能。',
            '61 点伤害配合不错的射速，是游戏中最强手枪之一。'
        ]
    },
    'Luison': {
        realName: 'Taurus PT92 (游戏改型)',
        caliber: '9x19mm Parabellum',
        country: '🇧🇷 巴西',
        manufacturer: 'Taurus',
        trivia: [
            'Luison 是 Caveira 的专属手枪，内置消音器。名字可能来自巴西民间传说。',
            '可用于审讯倒地的敌方干员获取全队位置信息，是游戏中独一无二的机制。'
        ]
    },
    'GONNE-6': {
        realName: '虚构武器 (单发榴弹/破障器)',
        caliber: '特殊破障弹',
        country: '未知',
        manufacturer: '虚构',
        trivia: [
            'GONNE-6 只有 1 发弹药，专门用于摧毁防弹设备（如 Maestro 的邪眼、防弹摄像头等）。',
            '不能杀死满血干员（10 伤害），纯粹是战术工具。'
        ]
    },

    // ===== 副武器 - 左轮 =====
    'LFP586': {
        realName: 'Manurhin MR 73',
        caliber: '.357 Magnum',
        country: '🇫🇷 法国',
        manufacturer: 'Manurhin',
        trivia: [
            'MR 73 被认为是世界上精度最高的左轮手枪之一，是法国 GIGN 的标志性武器。',
            'GIGN 前指挥官曾称赞它"是唯一一把你可以信赖用单手在 25 米击中目标的手枪"。'
        ]
    },
    'Keratos .357': {
        realName: 'Chiappa Rhino 60DS',
        caliber: '.357 Magnum',
        country: '🇮🇹 意大利',
        manufacturer: 'Chiappa Firearms',
        trivia: [
            'Chiappa Rhino 独特之处在于枪管对齐最下面的弹膛（而非通常的最上面），大幅降低了射击时枪口上跳。',
            '是游戏中唯一可以装消音器的左轮手枪。'
        ]
    }
};

// ---- 武器图片资源映射 ----
// 来源: Fandom Wiki CDN (static.wikia.nocookie.net/rainbowsix)
// 缩略图格式: R6S_[FileName].png  后坐力图格式: [Key]_Recoil.png
// 手动映射 — Fandom文件名不完全统一，需逐武器确认

const FANDOM_CDN = 'https://static.wikia.nocookie.net/rainbowsix/images';
const HUIJI_CDN = 'https://huiji-public.huijistatic.com/r6s/uploads';

// 武器图片映射表 — hash路径通过 Fandom MediaWiki API 逐一验证 (2026-03-30)
// 格式: { thumb: 'X/XX/文件名', recoil: 'X/XX/文件名' | null }
const WEAPON_IMAGES = {
    // === 突击步枪 ===
    // huijiRecoil: 灰机wiki后坐力图 hash路径 (无握把_无枪口 版本)
    'R4-C':            { thumb: '2/27/R6S_R4-C.png', recoil: '3/30/R4C_Recoil.png', huijiRecoil: '9/9d/Backlash_r4c_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'L85A2':           { thumb: '9/94/R6S_L85A2.png', recoil: null, huijiRecoil: '0/0d/Backlash_l85a2_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'G36C':            { thumb: '4/49/R6S_G36C.png', recoil: null, huijiRecoil: '6/65/Backlash_g36c_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'AK-12':           { thumb: 'b/bc/R6S_AK-12.png', recoil: 'f/fa/AK12_Recoil.png', huijiRecoil: 'e/e0/Backlash_ak12_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'F2':              { thumb: '9/94/R6S_F2.png', recoil: null, huijiRecoil: '7/71/Backlash_f2_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    '556XI':           { thumb: '8/81/R6S_556xi.png', recoil: null, huijiRecoil: '6/6f/Backlash_556xi_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'M4':              { thumb: 'c/cf/R6S_M4.png', recoil: null, huijiRecoil: '2/23/Backlash_m4_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'AR33':            { thumb: '4/40/R6S_AR33.png', recoil: null, huijiRecoil: 'f/f8/Backlash_ar33_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'Commando 9':      { thumb: '9/9d/R6S_Commando_9.png', recoil: null, huijiRecoil: '4/42/Backlash_commando9_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'AUG A2':          { thumb: '5/5e/R6S_AUG_A2.png', recoil: null, huijiRecoil: 'f/f9/Backlash_auga2_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    '552 Commando':    { thumb: '0/0d/R6S_552_Commando.png', recoil: null, huijiRecoil: '7/77/Backlash_552commando_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    '416-C CARBINE':   { thumb: 'a/a8/R6S_416-C_Carbine.png', recoil: null, huijiRecoil: 'c/c1/Backlash_416ccarbine_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'C8-SFW':          { thumb: '6/65/R6S_C8-SFW.png', recoil: null, huijiRecoil: '6/6b/Backlash_c8sfw_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'Mk17 CQB':        { thumb: '3/31/R6S_Mk17_CQB.png', recoil: null, huijiRecoil: '5/5c/Backlash_mk17cqb_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'PARA-308':        { thumb: '2/29/R6S_PARA-308.png', recoil: null, huijiRecoil: 'b/ba/Backlash_para308_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'Type-89':         { thumb: 'f/f0/R6S_Type-89.png', recoil: null, huijiRecoil: '1/13/Backlash_type89_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'C7E':             { thumb: 'b/b1/R6S_C7E.png', recoil: null, huijiRecoil: '1/12/Backlash_c7e_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'M762':            { thumb: 'b/be/R6S_M762.png', recoil: null, huijiRecoil: '1/13/Backlash_m762_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'V308':            { thumb: 'e/e7/R6S_V308.png', recoil: null, huijiRecoil: 'c/ce/Backlash_v308_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'Spear .308':      { thumb: '5/58/R6S_Spear_.308.png', recoil: null, huijiRecoil: '3/3e/Backlash_spear308_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'AR-15.50':        { thumb: '1/18/R6S_AR-15.50.png', recoil: null, huijiRecoil: 'f/f4/Backlash_ar1550_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'AK-74M':          { thumb: 'a/a6/R6S_AK-74M.png', recoil: null, huijiRecoil: '7/7b/Backlash_ak74m_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'ARX200':          { thumb: '7/7f/R6S_ARX200.png', recoil: null, huijiRecoil: '8/81/Backlash_arx200_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'F90':             { thumb: '3/3a/R6S_F90.png', recoil: null, huijiRecoil: '6/62/Backlash_f90_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'SC3000K':         { thumb: '2/2b/R6S_SC3000K.png', recoil: null, huijiRecoil: 'a/ae/Backlash_sc3000k_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'POF-9': { thumb: null, recoil: null, huijiRecoil: 'a/af/Backlash_pof9_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg', huijiThumb: 'f/f1/R6S_wpn_POF-9.png' },
    'PCX-33':          { thumb: null, recoil: null }, // 灰机wiki暂无此武器后坐力图
    'XK23':            { thumb: null, recoil: null }, // Y11S2新武器，暂无图片资源

    // === 冲锋枪 ===
    'FMG-9':           { thumb: 'f/f2/R6S_FMG-9.png', recoil: null, huijiRecoil: 'c/ca/Backlash_fmg9_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'MP5K':            { thumb: '8/8f/R6S_MP5K.png', recoil: null, huijiRecoil: 'd/d4/Backlash_mp5k_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'UMP45':           { thumb: '0/02/R6S_UMP45.png', recoil: null, huijiRecoil: '8/8a/Backlash_ump45_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'MP5':             { thumb: '6/6c/R6S_MP5_.png', recoil: null, huijiRecoil: '2/28/Backlash_mp5_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'P90':             { thumb: 'e/ec/R6S_P90.png', recoil: null, huijiRecoil: '0/0a/Backlash_p90_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'MP5SD':           { thumb: 'e/e7/R6S_MP5SD.png', recoil: null, huijiRecoil: '7/7e/Backlash_mp5sd_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    '9x19VSN':         { thumb: 'f/f8/R6S_9x19VSN.png', recoil: null, huijiRecoil: '5/5c/Backlash_9x19vsn_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'MP7':             { thumb: '7/7d/R6S_MP7.png', recoil: null, huijiRecoil: 'f/f9/Backlash_mp7_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    '9mm C1':          { thumb: 'b/b4/R6S_9mmC1.jpg', recoil: null, huijiRecoil: 'd/da/Backlash_9mmc1_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'MPX':             { thumb: '0/0b/R6S_MPX.png', recoil: null, huijiRecoil: '8/8f/Backlash_mpx_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'M12':             { thumb: 'a/ad/R6S_M12.png', recoil: null, huijiRecoil: '6/67/Backlash_m12_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'PDW9':            { thumb: '8/88/R6S_PDW9.png', recoil: null, huijiRecoil: '0/0d/Backlash_pdw9_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'Vector .45':      { thumb: '2/29/R6S_Vector_.45_ACP.png', recoil: null, huijiRecoil: 'a/a6/Backlash_vector45acp_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'T-5 SMG':         { thumb: '9/90/R6S_T-5_SMG.png', recoil: null, huijiRecoil: '4/41/Backlash_t5smg_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'Scorpion EVO':    { thumb: '5/57/R6S_Scorpion_EVO_3_A1.png', recoil: null, huijiRecoil: 'e/e1/Backlash_scorpionevo3a1_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'K1A':             { thumb: 'e/e4/R6S_K1A.png', recoil: null, huijiRecoil: '6/64/Backlash_k1a_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'Mx4 Storm':       { thumb: '4/48/R6S_Mx4_Storm.png', recoil: null, huijiRecoil: 'e/e3/Backlash_mx4storm_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'AUG A3':          { thumb: '6/62/R6S_AUG_A3.png', recoil: null, huijiRecoil: '4/44/Backlash_auga3_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'P10 RONI':        { thumb: 'b/b4/R6S_P10_RONI.png', recoil: null, huijiRecoil: 'f/f8/Backlash_p10roni_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'UZK50GI': { thumb: null, recoil: null, huijiRecoil: 'b/ba/Backlash_uzk50gi_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg', huijiThumb: 'a/ab/R6S_wpn_UZK50GI.png' },

    // === 轻机枪 ===
    'M249':            { thumb: 'e/ea/R6S_M249.png', recoil: null, huijiRecoil: '5/52/Backlash_m249_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    '6P41':            { thumb: '4/4a/R6S_6P41.png', recoil: null, huijiRecoil: 'c/cd/Backlash_6p41_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'G8A1':            { thumb: '6/6d/R6S_G8A1.png', recoil: null, huijiRecoil: '0/09/Backlash_g8a1_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'T-95 LSW':        { thumb: 'c/cf/R6S_T-95_LSW.png', recoil: null, huijiRecoil: '1/16/Backlash_t95lsw_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'LMG-E':           { thumb: '5/5a/R6S_LMG-E.png', recoil: null, huijiRecoil: '9/95/Backlash_lmge_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'ALDA 5.56':       { thumb: '9/91/R6S_ALDA_5.56.png', recoil: null, huijiRecoil: '8/84/Backlash_alda556_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'M249 SAW':        { thumb: '8/8f/R6S_M249_SAW.png', recoil: null, huijiRecoil: '2/26/Backlash_m249saw_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'DP27':            { thumb: '4/4a/R6S_DP27.png', recoil: null, huijiRecoil: '5/53/Backlash_dp27_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },

    // === 狙击/射手 ===
    'CSRX 300':        { thumb: '9/99/R6S_CSRX_300.png', recoil: null, huijiRecoil: '8/8c/Backlash_csrx300_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    '417':             { thumb: '1/18/R6S_417.png', recoil: null, huijiRecoil: '4/40/Backlash_417_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'OTs-03':          { thumb: '9/9d/R6S_OTs-03.png', recoil: null, huijiRecoil: '9/98/Backlash_ots03_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'CAMRS':           { thumb: '6/6d/R6S_CAMRS.png', recoil: null, huijiRecoil: 'e/e3/Backlash_camrs_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'SR-25':           { thumb: '0/0f/R6S_SR-25.png', recoil: null, huijiRecoil: '6/60/Backlash_sr25_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'Mk 14 EBR':       { thumb: 'd/d3/R6S_Mk_14_EBR.png', recoil: null, huijiRecoil: 'a/a9/Backlash_mk14ebr_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },

    // === 霰弹枪 ===
    'M870':            { thumb: '7/78/R6S_M870.png', recoil: null, huijiRecoil: 'd/db/Backlash_m870_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'M590A1':          { thumb: 'c/c0/R6S_M590A1.png', recoil: null, huijiRecoil: '8/8a/Backlash_m590a1_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'M1014':           { thumb: '8/8b/R6S_M1014.png', recoil: null, huijiRecoil: '0/02/Backlash_m1014_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'SG-CQB':          { thumb: '3/36/R6S_SG-CQB.png', recoil: null, huijiRecoil: '5/50/Backlash_sgcqb_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'SASG-12':         { thumb: '3/38/R6S_SASG-12.png', recoil: null, huijiRecoil: '0/07/Backlash_sasg12_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'SUPER 90':        { thumb: '7/7c/R6S_Super_90.png', recoil: null, huijiRecoil: 'f/ff/Backlash_super90_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'SPAS-12':         { thumb: '8/8d/R6S_SPAS-12.png', recoil: null, huijiRecoil: 'a/a2/Backlash_spas12_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'SPAS-15':         { thumb: '0/06/R6S_SPAS-15.png', recoil: null, huijiRecoil: 'a/aa/Backlash_spas15_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'SuperNova':       { thumb: 'b/b0/R6S_SuperNova.png', recoil: null, huijiRecoil: '9/95/Backlash_supernova_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'FO-12':           { thumb: '6/64/R6S_FO-12.png', recoil: null, huijiRecoil: 'f/f9/Backlash_fo12_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'SIX12': { thumb: null, recoil: null, huijiRecoil: '0/06/Backlash_six12_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg', huijiThumb: '9/99/R6S_wpn_SIX12.png' },
    'SIX12 SD': { thumb: null, recoil: null, huijiRecoil: 'c/c4/Backlash_six12sd_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg', huijiThumb: 'f/fa/R6S_wpn_SIX12_SD.png' },
    'BOSG.12.2':       { thumb: 'd/d7/R6S_BOSG.12.2.png', recoil: null, huijiRecoil: 'f/fa/Backlash_bosg122_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'ACS12':           { thumb: 'a/ac/R6S_ACS12.png', recoil: null, huijiRecoil: '4/45/Backlash_acs12_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'TCSG12':          { thumb: 'b/bf/R6S_TCSG12.png', recoil: null, huijiRecoil: '6/67/Backlash_tcsg12_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'ITA12L': { thumb: null, recoil: null, huijiRecoil: '6/65/Backlash_ita12l_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg', huijiThumb: '3/3d/R6S_wpn_ITA12L.png' },
    'Glaive-12': { thumb: null, recoil: null, huijiRecoil: null, huijiThumb: '3/31/R6S_wpn_Glaive-12.png' },

    // === 副武器 ===
    'SMG-11':          { thumb: '3/3b/R6S_SMG-11.png', recoil: null, huijiRecoil: 'e/e7/Backlash_smg11_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'SMG-12':          { thumb: '4/4b/R6S_SMG-12.png', recoil: null, huijiRecoil: '7/70/Backlash_smg12_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'Bearing 9':       { thumb: '9/94/R6S_Bearing_9.png', recoil: null, huijiRecoil: '3/37/Backlash_bearing9_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'C75 Auto':        { thumb: '8/8b/R6S_C75_Auto.png', recoil: null, huijiRecoil: 'f/fa/Backlash_c75auto_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'SPSMG9':          { thumb: 'a/aa/R6S_SPSMG9.png', recoil: null, huijiRecoil: '0/00/Backlash_spsmg9_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    '5.7 USG':         { thumb: 'e/e1/R6S_5.7_USG.png', recoil: null, huijiRecoil: '9/90/Backlash_57usg_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'P226 MK 25':      { thumb: '5/5b/R6S_P226_Mk_25.png', recoil: null, huijiRecoil: 'f/f0/Backlash_p226mk25_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'P9':              { thumb: '3/39/R6S_P9.png', recoil: null, huijiRecoil: '9/91/Backlash_p9_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'PMM':             { thumb: '7/73/R6S_PMM.png', recoil: null, huijiRecoil: '4/43/Backlash_pmm_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'P12':             { thumb: '9/95/R6S_P12.png', recoil: null, huijiRecoil: '5/57/Backlash_p12_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'D-50':            { thumb: '1/1a/R6S_D-50.png', recoil: null, huijiRecoil: '6/6a/Backlash_d50_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'LFP586':          { thumb: '1/1f/R6S_LFP586.png', recoil: null, huijiRecoil: 'b/bf/Backlash_lfp586_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'Keratos .357':    { thumb: '6/61/R6S_Keratos_.357.png', recoil: null, huijiRecoil: '6/64/Backlash_keratos357_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'ITA12S': { thumb: null, recoil: null, huijiRecoil: '2/2a/Backlash_ita12s_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg', huijiThumb: 'd/d1/R6S_wpn_ITA12S.png' },
    'Super Shorty': { thumb: null, recoil: null, huijiRecoil: '7/75/Backlash_supershorty_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg', huijiThumb: '4/43/R6S_wpn_Super_Shorty.png' },

    // === 2026-09-07 补齐：灰机wiki（Fandom 不可达期间的可用镜像源）===
    '.44 Mag Semi-Auto': { huijiRecoil: 'd/de/Backlash_44magsemiauto_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg', huijiThumb: '1/10/R6S_wpn_.44_Mag_Semi-Auto.png' },
    '.44 Vendetta': { huijiRecoil: '8/8f/Backlash_44vendetta_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg', huijiThumb: '9/91/R6S_wpn_.44_Vendetta.png' },
    '1911 TACOPS': { huijiRecoil: '1/15/Backlash_1911tacops_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg', huijiThumb: 'd/d6/R6S_wpn_1911_TACOPS.png' },
    'Bailiff 410': { huijiRecoil: '3/3e/Backlash_bailiff410_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg', huijiThumb: 'c/c9/R6S_wpn_Bailiff_410.png' },
    'GONNE-6': { huijiThumb: '6/63/R6S_wpn_GONNE-6.png' },
    'GSH-18': { huijiRecoil: '8/82/Backlash_gsh18_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg', huijiThumb: '4/4d/R6S_wpn_GSH-18.png' },
    'Luison': { huijiRecoil: '4/4f/Backlash_luison_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg', huijiThumb: 'f/f7/R6S_wpn_LUISON.png' },
    'M45 MEUSOC': { huijiRecoil: '7/7f/Backlash_m45meusoc_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg', huijiThumb: '1/1d/R6S_wpn_M45_MEUSOC.png' },
    'Mk1 9mm': { huijiRecoil: 'e/e5/Backlash_mk19mm_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg', huijiThumb: '9/9c/R6S_wpn_MK1_9mm.png' },
    'P-10C': { huijiRecoil: 'f/f8/Backlash_p10c_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg', huijiThumb: 'f/f5/R6S_wpn_P-10C.png' },
    'P229': { huijiRecoil: 'd/dc/Backlash_p229_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg', huijiThumb: '1/1c/R6S_wpn_P229.png' },
    'PCX-33': { huijiThumb: 'd/d7/R6S_wpn_PCX-33.png' },
    'PMR90A2': { huijiThumb: '5/58/R6S_wpn_PMR90A2.png' },
    'PRB92': { huijiRecoil: '5/59/Backlash_prb92_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg', huijiThumb: 'e/e7/R6S_wpn_PRB92.png' },
    'Q-929': { huijiRecoil: '0/07/Backlash_q929_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg', huijiThumb: '9/91/R6S_wpn_Q-929.png' },
    'RG15': { huijiRecoil: '1/1a/Backlash_rg15_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg', huijiThumb: 'a/a8/R6S_wpn_RG15.png' },
    'Reaper MK2': { huijiThumb: '5/5c/R6S_wpn_Reaper_MK2.png' },
    'SDP 9mm': { huijiRecoil: '9/97/Backlash_sdp9mm_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg', huijiThumb: 'f/fd/R6S_wpn_SDP_9mm.png' },
    'TACIT .45': { huijiThumb: '2/24/R6S_wpn_TACIT_.45.png' },
    'USP40': { huijiRecoil: '1/1a/Backlash_usp40_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg', huijiThumb: '9/95/R6S_wpn_USP40.png' },
    'XK23': { huijiThumb: '2/23/R6S_wpn_XK23.png' },
};

// 生成完整CDN URL的工具函数
function getWeaponThumbURL(weaponName) {
    const img = WEAPON_IMAGES[weaponName];
    if (!img) return null;
    // 优先灰机wiki 渲染图：Fandom 图片服务不稳定（近期曾整站 503），灰机为其镜像且当前可达
    if (img.huijiThumb) return HUIJI_CDN + '/' + img.huijiThumb;
    if (!img.thumb) return null;
    return FANDOM_CDN + '/' + img.thumb + '/revision/latest?cb=20220525145532';
}

function getWeaponRecoilURL(weaponName) {
    const img = WEAPON_IMAGES[weaponName];
    if (!img) return null;
    // 优先使用灰机wiki后坐力图（游戏内截图，更直观）
    if (img.huijiRecoil) return HUIJI_CDN + '/' + img.huijiRecoil;
    // 回退到Fandom散布图
    if (img.recoil) return FANDOM_CDN + '/' + img.recoil + '/revision/latest?cb=20210414053705';
    return null;
}


// ================================================================
// 干员数据
//   名单: 本站 WEAPONS.operators（保证与武器联动一致）
//   携带武器: 本站 WEAPONS 反查
//   阵营/护甲/速度/职能/技能: GitHub hanslhansl operators.json + Liquipedia
//   图标: r6operators CDN (OPERATOR_ICON_CDN)
//   无可靠来源的字段一律为 null，不做估算
// ================================================================
const OPERATORS = [
    { name: 'Ace', side: 'atk', icon: 'ace.svg', armor: '2', speed: 'medium', difficulty: 'easy', function: ['Breach', 'Anti-Gadget'], realname: 'Håvard Haugland', birthplace: '[https://en.wikipedia.org/wiki/L%C3%A6rdals%C3%B8yri Lærdalsøyri]', birthdate: '1987-3-15', affiliation: '[https://rainbowsix.fandom.com/wiki/NIGHTHAVEN NIGHTHAVEN]', country: [], releasedate: '2020-06-16', gadget: 'S.E.L.M.A. Aqua Breacher', gadget_desc: 'With the S.E.L.M.A. Aqua Breacher, water is the name of the game. It makes use of hydraulic pressure to burst through breakable and reinforced surfaces.', weapons: ['AK-12', 'M1014', 'P9'] },
    { name: 'Alibi', side: 'def', icon: 'alibi.svg', armor: '1', speed: 'fast', difficulty: 'hard', function: ['Intel', 'Trapper'], realname: 'Aria de Luca', birthplace: 'Tripoli', birthdate: '1980-12-15', affiliation: 'G.I.S', country: ['it'], releasedate: '2018-06-07', gadget: 'Prisma', gadget_desc: 'Prisma projects holograms are nearly identical to Alibi in an idle position. If you shoot or touch the holograms, you’ll be marked and pinged for the next few seconds. If Prisma is deployed outside, a false “Defender Outside” warning is triggered for Attackers. To add an element of surprise, Prisma conceals the identity of any Defender who ventures outside.', weapons: ['ACS12', 'Bailiff 410', 'Keratos .357', 'Mx4 Storm'] },
    { name: 'Amaru', side: 'atk', icon: 'amaru.svg', armor: '2', speed: 'medium', difficulty: 'normal', function: ['Front Line', 'Map Control'], realname: 'Azucena Rocío Quispe', birthplace: '[https://en.wikipedia.org/wiki/Cojata_District Cojata]', birthdate: '1971-05-06', affiliation: '[https://rainbowsix.fandom.com/wiki/APCA APCA]', country: ['pe'], releasedate: '2019-09-11', gadget: 'Garra Hook', gadget_desc: 'With the Garra Hook, Amaru can grapple onto ledges and windows and hoist herself up in record times. Her opponents now not only have to worry about attacks from above, but also attacks from below. With the Garra, Amaru is the only operator that can go up an unreinforced or open hatch, instead of down. When timed right, hooking the Garra onto a window can result in Amaru’s infamous Garra Kick, which instantly takes out an opponent standing behind the window.', weapons: ['G8A1', 'GONNE-6', 'ITA12S', 'SMG-11', 'SuperNova'] },
    { name: 'Aruni', side: 'def', icon: 'aruni.svg', armor: '3', speed: 'slow', difficulty: 'normal', function: ['Anti-Entry', 'Anti-Gadget'], realname: 'Apha Tawanroong', birthplace: '[https://en.wikipedia.org/wiki/Ta_Phraya_District Ta Phraya District]', birthdate: '1978-08-09', affiliation: null, country: [], releasedate: '2020-12-01', gadget: 'Prosthetic Arm', gadget_desc: 'Melee punch with destructive capabilities.', weapons: ['Mk 14 EBR', 'P10 RONI', 'PRB92'] },
    { name: 'Ash', side: 'atk', icon: 'ash.svg', armor: '1', speed: 'fast', difficulty: 'normal', function: ['Breach', 'Front Line'], realname: 'Eliza Cohen', birthplace: 'Jerusalem', birthdate: '1983-12-24', affiliation: 'SWAT', country: ['us'], releasedate: '2015-12-01', gadget: 'M120 CREM (Breaching Round)', gadget_desc: 'Modified grenade launcher capable of containing a single 40mm breaching round. Detonating shortly after impact.', weapons: ['5.7 USG', 'G36C', 'M45 MEUSOC', 'R4-C'] },
    { name: 'Azami', side: 'def', icon: 'azami.svg', armor: '2', speed: 'medium', difficulty: 'hard', function: ['Anti-Entry', 'Support'], realname: 'Kana Fujiwara', birthplace: 'Kyoto, Japan', birthdate: '1993-09-06', affiliation: null, country: [], releasedate: '2022-03-15', gadget: 'Kiba Barrier', gadget_desc: 'The Kiba Barrier is a modified kunai that sticks to a surface after it\'s thrown and releases a material that first expands then solidifies, creating a bulletproof barrier to patch up those holes in your defenses.', weapons: ['9x19VSN', 'ACS12', 'D-50'] },
    { name: 'Bandit', side: 'def', icon: 'bandit.svg', armor: '1', speed: 'fast', difficulty: 'easy', function: ['Anti-Entry', 'Anti-Gadget'], realname: 'Dominic Brunsmeier', birthplace: 'Berlin', birthdate: '1974-08-13', affiliation: 'GSG 9', country: ['de'], releasedate: '2015-12-01', gadget: 'CED-1 (Crude Electrical Device)', gadget_desc: 'The CED-1 features an taser wired to a car battery enclosed in a copper cage with jumper cables. It\'s defensive purpose is to destroy any gadget it comes in contact with making it a viable counter to exo-thermic charges and X-KAIROS pallets. Placeable on any metallic surface, it can protect barbed wire, deployable shields, and reinforced walls.', weapons: ['Keratos .357', 'M870', 'MP7', 'P12'] },
    { name: 'Blackbeard', side: 'atk', icon: 'blackbeard.svg', armor: '3', speed: 'slow', difficulty: 'normal', function: ['Breach', 'Front Line'], realname: 'Craig Jenson', birthplace: 'Bellevue', birthdate: '1985-03-12', affiliation: 'NAVY SEAL', country: ['us'], releasedate: '2016-05-10', gadget: 'H.U.L.L. Adaptable Shield', gadget_desc: 'The shield is capable of adapting its shape to grant the best cover while on foot and in rappel. The shield also includes a breaching pneumatic system that allows Blackbeard to create his own rotations by destroy soft walls. Blackbeard\'s weapon skills allow him to simultaneously equip the H.U.L.L. Adaptable Shield and primary weapons.', weapons: ['D-50', 'Mk17 CQB', 'SR-25'] },
    { name: 'Blitz', side: 'atk', icon: 'blitz.svg', armor: '2', speed: 'medium', difficulty: 'hard', function: ['Front Line', 'Map Control'], realname: 'Elias Kötz', birthplace: 'Bremen', birthdate: '1980-04-02', affiliation: 'GSG 9', country: ['de'], releasedate: '2015-12-01', gadget: 'G52-Tactical Shield', gadget_desc: 'Ballistic shield light enough to permit its wielder to sprint, it comes equipped with 24 flash-bang grenades spread over 3 rows providing a high intensity light source when triggered.', weapons: ['P12'] },
    { name: 'Brava', side: 'atk', icon: 'brava.svg', armor: '1', speed: 'fast', difficulty: 'hard', function: ['Intel', 'Anti-Gadget'], realname: 'Nayara Cardoso', birthplace: 'Curitiba, Brazil', birthdate: '1983-01-10', affiliation: 'COT', country: [], releasedate: '2023-03-07', gadget: 'Kludge Drone', gadget_desc: 'Brava\'s Kludge Drone is a sabotage tool capable of taking over opponents\' devices. If the device can\'t be controlled, it\'s destroyed instead.', weapons: ['CAMRS', 'PARA-308', 'Super Shorty', 'USP40'] },
    { name: 'Buck', side: 'atk', icon: 'buck.svg', armor: '2', speed: 'medium', difficulty: 'easy', function: ['Breach', 'Support'], realname: 'Sebastien Côté', birthplace: 'Montreal', birthdate: '1980-08-20', affiliation: 'JTF2', country: ['ca'], releasedate: '2016-02-02', gadget: 'SK 4-12 (Skeleton Key)', gadget_desc: 'Under-barrel mounted 12 gauge shotgun with four round capacity, used in tandem with an assault rifle. The Skeleton Key allows the operator to alternate between their standard issue assault rifle and a breaching shotgun with ease and efficiency.', weapons: ['C8-SFW', 'CAMRS', 'Mk1 9mm'] },
    { name: 'Capitão', side: 'atk', icon: 'capitao.svg', armor: '1', speed: 'fast', difficulty: 'normal', function: ['Front Line', 'Map Control'], realname: 'Vicente Souza', birthplace: 'Nova Iguaçu', birthdate: '1967-11-17', affiliation: 'BOPE', country: ['br'], releasedate: '2016-08-02', gadget: 'TAC MK0 Tactical Crossbow', gadget_desc: 'Use a glass bolt to deliver a swift and silent assault against hostiles without alerting them to your position. The glass cartridge breaks on impact releasing a gas that ignites the oxygen in the surrounding area. Deliver swift and agile assaults without alerting your opponents of your position.', weapons: ['M249', 'PARA-308', 'PMR90A2', 'PRB92'] },
    { name: 'Castle', side: 'def', icon: 'castle.svg', armor: '2', speed: 'medium', difficulty: 'normal', function: ['Anti-Entry', 'Support'], realname: 'Miles Campbell', birthplace: 'Los Angeles, California', birthdate: '1980-09-20', affiliation: 'SWAT', country: ['us'], releasedate: '2015-12-01', gadget: 'UTP1-Universal Tactical Panel', gadget_desc: 'Rollable armor panel made of Polyethylene, ballistic fabric, and boron ceramic micro plates.', weapons: ['5.7 USG', 'M1014', 'M45 MEUSOC', 'Super Shorty', 'UMP45'] },
    { name: 'Caveira', side: 'def', icon: 'caveira.svg', armor: '1', speed: 'fast', difficulty: 'hard', function: ['Intel', 'Crowd Control'], realname: 'Taina Pereira', birthplace: 'Rinópolis', birthdate: '1989-10-15', affiliation: 'BOPE', country: ['br'], releasedate: '2016-08-02', gadget: 'Silent Step', gadget_desc: 'Caveira\'s predatory stealth, the "Silent Step," allows her to lurk on her prey, leaving no footprints and almost inaudible, until it\'s too late.', weapons: ['Luison', 'M12', 'PRB92', 'SPAS-15'] },
    { name: 'Clash', side: 'def', icon: 'clash.svg', armor: '3', speed: 'slow', difficulty: 'hard', function: ['Intel', 'Crowd Control'], realname: 'Morowa Evans', birthplace: 'London', birthdate: '1983-06-07', affiliation: 'MPS GSUTR', country: ['uk'], releasedate: '2018-09-04', gadget: 'CCE Shield', gadget_desc: 'The CCE Shield is her primary weapon; she can swap to her secondary at any time, but to do so, she needs to put her shield away first. Her bulletproof extendable shield has the ability to slow down opponents by using a high voltage Charged Field Generator (CFG) that emanates directly in front of the shield in a cylindrical shape. Opponents caught in the CFG also sustain low damage over time. Effective use of the shield allows Clash to block entry points, and to prevent or delay a push by the Attackers.', weapons: ['P-10C', 'SPSMG9', 'Super Shorty'] },
    { name: 'Deimos', side: 'atk', icon: 'deimos.svg', armor: '2', speed: 'medium', difficulty: 'normal', function: ['Intel', 'Map Control'], realname: 'Gerald Morris', birthplace: 'Birmingham, Alabama', birthdate: '1972-12-24', affiliation: null, country: [], releasedate: '2024-02-24', gadget: 'DeathMark Tracker', gadget_desc: 'The miniature flying probe seeks out a chosen target and reveals their location to Deimos while also revealing his location. with his custom .44 Vendetta being the only weapon available while tracking, Deimos makes it personal.', weapons: ['.44 Vendetta', 'AK-74M', 'M590A1'] },
    { name: 'Denari', side: 'def', icon: 'denari.svg', armor: '1', speed: 'fast', difficulty: 'hard', function: ['Anti-Entry', 'Crowd Control'], realname: 'Leon Winzenried', birthplace: 'Lugano', birthdate: '1986-11-30', affiliation: null, country: [], releasedate: '2025-09-02', gadget: 'T.R.I.P Connector', gadget_desc: 'Cover an entire room with Denari\'s unique ability, the T.R.I.P. Connector. When two devices are deployed within line of sight of each other, a laser connects between them. Once tripped, the laser will slow and injure enemies. Deploying more devices will create a larger web of lasers, creating an area of denial to best fit defensive needs for any room.', weapons: ['FMG-9', 'Glaive-12', 'P226 MK 25', 'Scorpion EVO'] },
    { name: 'Doc', side: 'def', icon: 'doc.svg', armor: '3', speed: 'slow', difficulty: 'easy', function: ['Support'], realname: 'Gustave Kateb', birthplace: 'Paris', birthdate: '1977-09-16', affiliation: 'GIGN', country: ['fr'], releasedate: '2015-12-01', gadget: 'MPD-0 Stim Pistol', gadget_desc: 'Handheld, trigger operated pistol powered by a pressurized CO2 canister. Contains a 1mg dose of epinephrine, in a saline solution.', weapons: ['Bailiff 410', 'LFP586', 'MP5', 'P9', 'P90', 'SG-CQB'] },
    { name: 'Dokkaebi', side: 'atk', icon: 'dokkaebi.svg', armor: '1', speed: 'fast', difficulty: 'normal', function: ['Intel', 'Map Control'], realname: 'Grace Nam', birthplace: 'Seoul', birthdate: '1988-2-2', affiliation: '707th SMB', country: ['kr'], releasedate: '2017-12-05', gadget: 'Logic Bomb', gadget_desc: 'Grace utilizes the Ballistic Armor Military Laptop, codenamed Logic Bomb, which she uses to hack enemy PDA tactical devices. The program downloads a virus of her making that can bypass firewalls, turning surrounding devices on and emitting a loud noise to compromise an enemy’s position.', weapons: ['BOSG.12.2', 'C75 Auto', 'GONNE-6', 'Mk 14 EBR', 'SMG-12', 'XK23'] },
    { name: 'Echo', side: 'def', icon: 'echo.svg', armor: '3', speed: 'slow', difficulty: 'hard', function: ['Intel', 'Crowd Control'], realname: 'Masaru Enatsu', birthplace: 'Suginami', birthdate: '1980-10-31', affiliation: 'S.A.T.', country: ['jp'], releasedate: '2016-11-17', gadget: 'YOKAI (Unmanned hovering vehicle)', gadget_desc: 'Equipped with an acoustic hailing device, this signature drone can fire ultrasonic bursts that disorient all targets in a given perimeter. Yokai also transmits a video feed to Echo, who keeps his immediate perimeter secure. Embrace the power of technology and embody a turret Defender who can both hold up the siege and support roamers.', weapons: ['Bearing 9', 'MP5SD', 'P229', 'SuperNova'] },
    { name: 'Ela', side: 'def', icon: 'ela.svg', armor: '2', speed: 'medium', difficulty: 'easy', function: ['Trapper', 'Crowd Control'], realname: 'Elżbieta Bosak', birthplace: 'Wrocław', birthdate: '1985-11-08', affiliation: 'GROM', country: ['pl'], releasedate: null, gadget: 'Grzmot Mine', gadget_desc: 'Inspired by the 1939 anti-tank Polish grenades used by the iconic Cichociemny during WWII, the sticky Grzmot mines can be anchored on surfaces, impairing hearing and causing a dizzying effect. These concussion mines are triggered upon proximity, affecting anyone within its radius.', weapons: ['FO-12', 'RG15', 'Scorpion EVO'] },
    { name: 'Fenrir', side: 'def', icon: 'fenrir.svg', armor: '2', speed: 'medium', difficulty: 'hard', function: ['Trapper', 'Crowd Control'], realname: 'Emil Svensson', birthplace: 'Uppsala, Sweden', birthdate: '1989-12-03', affiliation: null, country: [], releasedate: '2023-05-30', gadget: 'F-NATT DREAD MINE', gadget_desc: 'The F-NATT DREAD MINE is a throwable device that sticks to walls, so it can be hidden in places where fear can fester. Fenrir comes equipped with 4 mines and can activate 2 at a time anywhere on the map.', weapons: ['5.7 USG', 'MP7', 'SASG-12'] },
    { name: 'Finka', side: 'atk', icon: 'finka.svg', armor: '2', speed: 'medium', difficulty: 'easy', function: ['Front Line', 'Support'], realname: 'Lera Melnikova', birthplace: 'Gomel', birthdate: '1989-06-07', affiliation: 'Spetsnaz CBRN', country: ['ru'], releasedate: '2018-03-06', gadget: 'Nanobot Shots', gadget_desc: 'Finka\'s Adrenal Surge activates pre-injected nanobots made of zinc in operators, releasing a pharmacological cocktail into their system where the zinc is absorbed as a nutrient. These nanites give her team a short boost in HP, increase aim speed and help allies out of DBNO including herself instead of the person capturing by Welcome Mat. She’s the only one capable of tailoring the nanites to specific operators.', weapons: ['6P41', 'GONNE-6', 'GSH-18', 'PMM', 'SASG-12', 'Spear .308'] },
    { name: 'Flores', side: 'atk', icon: 'flores.svg', armor: '2', speed: 'medium', difficulty: 'normal', function: ['Anti-Gadget', 'Intel'], realname: 'Santiago Miguel Lucero', birthplace: '[https://en.wikipedia.org/wiki/Buenos_Aires Buenos Aires]', birthdate: '1982-10-02', affiliation: null, country: [], releasedate: '2021-03-16', gadget: 'RCE-Ratero Charge', gadget_desc: 'Controlled from a distance, the RCE-Ratero Charge races forward while Flores scouts a location for its blast. Once triggered, the Ratero clutches onto the nearest surface, armors itself with a bulletproof shell, and explodes, destroying nearby gadgets and soft surfaces.', weapons: ['AR33', 'GONNE-6', 'GSH-18', 'SR-25', 'T-95 LSW'] },
    { name: 'Frost', side: 'def', icon: 'frost.svg', armor: '2', speed: 'medium', difficulty: 'easy', function: ['Anti-Entry', 'Trapper'], realname: 'Tina Lin Tsang', birthplace: 'Vancouver', birthdate: '1985-03-04', affiliation: 'JTF2', country: ['ca'], releasedate: '2016-02-02', gadget: 'Sterling MK2 LHT (Welcome Mat)', gadget_desc: 'Requiring two people to release the jaws and reset the trap. The rubber mat and concealed metal jaws are bolted in place. When the pressure plate is engaged, two sets of jaws at ankle and shin height deploy, locking the person in place.', weapons: ['9mm C1', 'ITA12S', 'Mk1 9mm', 'SUPER 90'] },
    { name: 'Fuze', side: 'atk', icon: 'fuze.svg', armor: '3', speed: 'slow', difficulty: 'easy', function: ['Anti-Gadget'], realname: 'Shuhrat Kessikbayev', birthplace: 'Samarkand', birthdate: '1982-10-12', affiliation: 'Spetsnaz', country: ['ru'], releasedate: '2015-12-01', gadget: 'APM-6 "Matryoshka" Cluster Charge', gadget_desc: 'Featuring a piston that burrows through unreinforced walls, floors and even armor panels with ease, the "Matryoshka", when anchored, shoots live cluster grenades.', weapons: ['6P41', 'AK-12', 'GSH-18', 'PMM'] },
    { name: 'Glaz', side: 'atk', icon: 'glaz.svg', armor: '1', speed: 'fast', difficulty: 'normal', function: ['Intel', 'Support'], realname: 'Timur Glazkov', birthplace: 'Vladivostok', birthdate: '1987-07-02', affiliation: 'Spetsnaz', country: ['ru'], releasedate: '2015-12-01', gadget: 'HDS Flip Sight', gadget_desc: 'Mounted on a hinge allowing it to flip into position, the HDS Flip Sight provides the wielder access to an unmatched level of zoom as well as the ability to see through smoke.', weapons: ['Bearing 9', 'GONNE-6', 'GSH-18', 'OTs-03', 'PMM'] },
    { name: 'Goyo', side: 'def', icon: 'goyo.svg', armor: '2', speed: 'medium', difficulty: 'normal', function: ['Anti-Entry', 'Trapper'], realname: 'César Ruiz Hernández', birthplace: '[https://en.wikipedia.org/wiki/Culiac%C3%A1n Culiacán Rosales]', birthdate: '1988-06-20', affiliation: '[https://en.wikipedia.org/wiki/Fuerzas_Especiales FES]', country: ['mx'], releasedate: '2019-09-11', gadget: 'Volcán Canister', gadget_desc: 'Volcán Canisters are incendiary bomb which partially shielded and can be deployed on surfaces such as walls and floors. Their explosive damage has been reduced but the flames burn for longer than they did before.', weapons: ['P229', 'TCSG12', 'Vector .45'] },
    { name: 'Gridlock', side: 'atk', icon: 'gridlock.svg', armor: '3', speed: 'slow', difficulty: 'easy', function: ['Support', 'Map Control'], realname: 'Tori Tallyo Fairous', birthplace: '[https://en.wikipedia.org/wiki/Longreach,_Queensland Longreach, Central Queensland]', birthdate: '1982-08-05', affiliation: '[https://en.wikipedia.org/wiki/Special_Air_Service_Regiment SASR]', country: ['au'], releasedate: '2019-03-06', gadget: 'Trax Stingers', gadget_desc: 'Thrown gadget that deploys barbed mats capable of slowing down and hurting enemies who traverse them.', weapons: ['F90', 'GONNE-6', 'M249 SAW', 'SDP 9mm', 'Super Shorty'] },
    { name: 'Grim', side: 'atk', icon: 'grim.svg', armor: '1', speed: 'fast', difficulty: 'easy', function: ['Front Line', 'Map Control'], realname: 'Charlie Tho Keng Boon', birthplace: 'Jurong, Singapore', birthdate: '1983-04-05', affiliation: 'NDU', country: [], releasedate: '2022-09-06', gadget: 'Kawan Hive Launcher', gadget_desc: 'You\'ve heard the buzz, and the Kawan Hive Launcher is here! Firing off a projectile releases a swarm of bots that track the location of opponents who walk through it. Just don\'t get them in your eyes.', weapons: ['552 Commando', 'Bailiff 410', 'P229', 'SG-CQB'] },
    { name: 'Hibana', side: 'atk', icon: 'hibana.svg', armor: '1', speed: 'fast', difficulty: 'easy', function: ['Breach', 'Front Line'], realname: 'Yumiko Imagawa', birthplace: 'Nagoya', birthdate: '1983-07-12', affiliation: 'S.A.T.', country: ['jp'], releasedate: '2016-11-17', gadget: 'X-KAIROS (40mm Caliber Launcher)', gadget_desc: 'The X-KAIROS - a 40mm caliber launcher capable of breaching reinforced walls - fires explosive pellets that can be detonated simultaneously from a distance.', weapons: ['Bearing 9', 'P229', 'PMR90A2', 'SuperNova', 'Type-89'] },
    { name: 'IQ', side: 'atk', icon: 'iq.svg', armor: '1', speed: 'fast', difficulty: 'hard', function: ['Intel', 'Support'], realname: 'Monika Weiss', birthplace: 'Leipzig', birthdate: '1979-08-01', affiliation: 'GSG 9', country: ['de'], releasedate: '2015-12-01', gadget: 'Red MKIII "Spectre" Electronics Detector', gadget_desc: 'Wrist mounted mobile phone-sized sensor capable of detecting electronic gadgets and equipment within its range.', weapons: ['552 Commando', 'AUG A2', 'G8A1', 'P12'] },
    { name: 'Iana', side: 'atk', icon: 'iana.svg', armor: '2', speed: 'medium', difficulty: 'easy', function: ['Front Line', 'Intel'], realname: 'Nienke Meijer', birthplace: '[https://en.wikipedia.org/wiki/Katwijk Katwijk]', birthdate: '1984-8-27', affiliation: '[https://rainbowsix.fandom.com/wiki/REU REU]', country: ['nl'], releasedate: '2020-03-10', gadget: 'Gemini Replicator', gadget_desc: 'The Gemini Replicator is a remotely-controlled holographic copy of iana. When she deploys it, she can scout ahead with little to no consequences.', weapons: ['ARX200', 'G36C', 'GONNE-6', 'Mk1 9mm'] },
    { name: 'Jackal', side: 'atk', icon: 'jackal.svg', armor: '2', speed: 'medium', difficulty: 'hard', function: ['Intel', 'Map Control'], realname: 'Ryad Ramírez Al-Hassar', birthplace: 'Ceuta', birthdate: '1968-02-29', affiliation: 'G.E.O.', country: ['es'], releasedate: '2017-02-07', gadget: 'Eyenox Model III', gadget_desc: 'Eyenox Model III was created to offer a mobile tracking device able to both identify and trail a person’s footprints in real-time. Equipped with advanced computer vision, the Eyenox detects invisible details relating to footfall and weight distribution so that you can identify and stalk your target.', weapons: ['C7E', 'ITA12L', 'ITA12S', 'PDW9', 'USP40'] },
    { name: 'Jäger', side: 'def', icon: 'jager.svg', armor: '2', speed: 'medium', difficulty: 'normal', function: ['Anti-Gadget', 'Support'], realname: 'Marius Streicher', birthplace: 'Düsseldorf', birthdate: '1978-03-09', affiliation: 'GSG 9', country: ['de'], releasedate: '2015-12-01', gadget: 'ADS-MK IV "Magpie"', gadget_desc: 'Full range grenade launcher mountable on walls and floors featuring four surveillance cameras allowing for precise targeting of hostile equipment.', weapons: ['416-C CARBINE', 'M870', 'P-10C', 'P12'] },
    { name: 'Kaid', side: 'def', icon: 'kaid.svg', armor: '3', speed: 'slow', difficulty: 'normal', function: ['Anti-Entry', 'Anti-Gadget'], realname: 'Jalal El Fassi', birthplace: 'Aroumd, Morocco', birthdate: '1960-06-26', affiliation: 'GIGR', country: ['ma'], releasedate: '2018-12-04', gadget: '"Rtila" Electroclaw', gadget_desc: 'Kaid’s "Rtila" Electroclaw can electrify reinforced walls and hatches, barbed wire, and deployable shields, making it tougher for the enemy to breach the Kasbah and any facility he’s tasked with protecting. He enters the field with two of these throwable gadgets. Once they’ve attached themselves to a surface, they each electrify metallic objects within a 0.75 meter radius.', weapons: ['.44 Mag Semi-Auto', 'AUG A3', 'GONNE-6 Rev', 'LFP586', 'TCSG12'] },
    { name: 'Kali', side: 'atk', icon: 'kali.svg', armor: '2', speed: 'medium', difficulty: 'normal', function: ['Anti-Gadget', 'Support'], realname: 'Jaimini Kalimohan Shah', birthplace: '[https://en.wikipedia.org/wiki/Amreli Amreli]', birthdate: '1985-08-21', affiliation: null, country: [], releasedate: '2019-12-03', gadget: 'LV Explosive Lance', gadget_desc: 'To talk about the LV Explosive Lance, we need to mention Kali’s CSRX 300. It’s a dangerous weapon that can breach barricades and hatches in a single shot, and create big holes in breakable walls. The LV is its under-barrel, and it can be used at the same time as the CSRX 300’s scopes.', weapons: ['C75 Auto', 'CSRX 300', 'P226 MK 25', 'SPSMG9'] },
    { name: 'Kapkan', side: 'def', icon: 'kapkan.svg', armor: '2', speed: 'medium', difficulty: 'easy', function: ['Anti-Entry', 'Trapper'], realname: 'Maxim Basuda', birthplace: 'Kovrov', birthdate: '1979-05-14', affiliation: 'Spetsnaz', country: ['ru'], releasedate: '2015-12-01', gadget: 'EDD MK II Entry Denial Device', gadget_desc: 'C4 charge that may be mounted into windows and door frames.', weapons: ['9x19VSN', 'GSH-18', 'PMM', 'SASG-12'] },
    { name: 'Lesion', side: 'def', icon: 'lesion.svg', armor: '2', speed: 'medium', difficulty: 'easy', function: ['Anti-Entry', 'Trapper'], realname: 'Liu Tze Long', birthplace: 'Tseung Kwan O', birthdate: '1972-07-02', affiliation: 'S.D.U.', country: ['hk'], releasedate: '2017-09-05', gadget: 'Gu Mine', gadget_desc: 'Gu mines were inspired by the sharp punji sticks used during the Vietnam War. Rubbed with toxic plants or feces, the stakes served to slow down enemy troops by causing severe infections in their camp. Similarly, Gu mines inject a toxin that injure your opponent and limit their speed.', weapons: ['Q-929', 'SIX12 SD', 'T-5 SMG'] },
    { name: 'Lion', side: 'atk', icon: 'lion.svg', armor: '2', speed: 'medium', difficulty: 'easy', function: ['Intel', 'Map Control'], realname: 'Olivier Flament', birthplace: 'Toulouse', birthdate: '1985-08-29', affiliation: 'GIGN CBRN', country: ['fr'], releasedate: '2018-03-06', gadget: 'EE-ONE-D', gadget_desc: 'Twitch provided him with an aerial drone while he served with GIGN. The EE-ONE-D helps Lion maintain quarantine by detecting movement in an area, giving an overview of hot zones or of the battlefield. His drone can stay airborne indefinitely, but he must choose the right moment to perform his scans.', weapons: ['417', 'GONNE-6', 'LFP586', 'P9', 'SG-CQB', 'V308'] },
    { name: 'Maestro', side: 'def', icon: 'maestro.svg', armor: '3', speed: 'slow', difficulty: 'normal', function: ['Anti-Gadget', 'Intel'], realname: 'Adriano Martello', birthplace: 'Rome', birthdate: '1973-4-13', affiliation: 'G.I.S', country: ['it'], releasedate: '2018-06-07', gadget: 'Evil Eye', gadget_desc: 'Remote-controlled turret firing high-energy laser beams. Once affixed to the floor or wall, Maestro can remote-surveil and provide overwatch in a location through the swivel-mounted camera. When the camera device breaks open to fire a laser beam the core is exposed to damage. Otherwise, the turret is unaffected by bullets and melee. Lastly, Evil Eye can see through smoke.', weapons: ['ACS12', 'ALDA 5.56', 'Bailiff 410', 'Keratos .357'] },
    { name: 'Maverick', side: 'atk', icon: 'maverick.svg', armor: '1', speed: 'fast', difficulty: 'normal', function: ['Breach', 'Front Line'], realname: 'Erik Thorn', birthplace: 'Boston', birthdate: '1982-04-20', affiliation: 'The Unit GSUTR', country: ['us'], releasedate: '2018-09-04', gadget: 'Exothermic-S "SURI" Torch', gadget_desc: 'Maverick’s D.I.Y. blowtorch can breach any surface, including reinforced walls and hatches. It requires a steady hand and knowledge of the environment to create small holes and lines of sight. Maverick must be in close range to use his gadget on the chosen surface.', weapons: ['1911 TACOPS', 'AR-15.50', 'M4', 'Reaper MK2'] },
    { name: 'Melusi', side: 'def', icon: 'melusi.svg', armor: '3', speed: 'slow', difficulty: 'easy', function: ['Crowd Control', 'Intel'], realname: 'Thandiwe Ndlovu', birthplace: '[https://en.wikipedia.org/wiki/Louwsburg Louwsburg]', birthdate: '1988-6-16', affiliation: 'ITF', country: [], releasedate: '2020-06-16', gadget: 'Banshee Sonic Defense', gadget_desc: 'The Banshee Sonic Defense is deployable on surfaces, much like Maestro’s Evil Eyes, but they don’t require any manual control, as soon as an opponent walks close enough to it, it will release its scream and slow them.', weapons: ['ITA12S', 'MP5', 'RG15', 'SUPER 90'] },
    { name: 'Mira', side: 'def', icon: 'mira.svg', armor: '3', speed: 'slow', difficulty: 'hard', function: ['Intel', 'Support'], realname: 'Elena María Álvarez', birthplace: 'Madrid', birthdate: '1977-11-18', affiliation: 'G.E.O.', country: ['es'], releasedate: '2017-02-07', gadget: 'Black Mirror', gadget_desc: 'A one-way bulletproof mirror placeable on breakable and reinforcable walls. The window can also be ejected to create a murder hole.', weapons: ['ITA12L', 'ITA12S', 'USP40', 'Vector .45'] },
    { name: 'Montagne', side: 'atk', icon: 'montagne.svg', armor: '3', speed: 'slow', difficulty: 'hard', function: ['Intel', 'Support'], realname: 'Gilles Touré', birthplace: 'Bordeaux', birthdate: '1968-10-11', affiliation: 'GIGN', country: ['fr'], releasedate: '2015-12-01', gadget: '"Le Roc" Extendable Shield', gadget_desc: 'Made from a composite of reinforced alloys and Kevlar, "Le Roc" is capable of collapsing into half its size, allowing for increased mobility to its wielder.', weapons: ['LFP586', 'P9'] },
    { name: 'Mozzie', side: 'def', icon: 'mozzie.svg', armor: '2', speed: 'medium', difficulty: 'normal', function: ['Anti-Gadget', 'Intel'], realname: 'Max Goose', birthplace: '[https://en.wikipedia.org/wiki/Portland,_Victoria Portland]', birthdate: '1984-02-15', affiliation: '[https://en.wikipedia.org/wiki/Special_Air_Service_Regiment SASR]', country: ['au'], releasedate: '2019-03-06', gadget: 'Pest Launcher', gadget_desc: 'Launches autonomous bots that latch onto nearby enemy drones, hijacking their controls.', weapons: ['Commando 9', 'P10 RONI', 'SDP 9mm'] },
    { name: 'Mute', side: 'def', icon: 'mute.svg', armor: '3', speed: 'slow', difficulty: 'easy', function: ['Anti-Gadget', 'Crowd Control'], realname: 'Mark Chander', birthplace: 'York', birthdate: '1991-10-11', affiliation: 'S.A.S.', country: ['uk'], releasedate: null, gadget: 'GC90 Signal Disrupter', gadget_desc: 'He brings with him a Signal Disruptor from his former career, which allows Chandar to jam all communications in a set area, preventing remote detonations, the use of drones and him and his teammates can remain hidden from Lion’s scan if within range of the jammer. The GC90 “Moni”, blocks the signal from a remote detonator or control from reaching any device within range.', weapons: ['M590A1', 'MP5K', 'P226 MK 25', 'SMG-11'] },
    { name: 'Nomad', side: 'atk', icon: 'nomad.svg', armor: '2', speed: 'medium', difficulty: 'hard', function: ['Front Line', 'Map Control'], realname: 'Sanaa El Maktoub', birthplace: 'Marrakesh, Morocco', birthdate: '1979-07-27', affiliation: 'GIGR', country: ['ma'], releasedate: '2018-12-04', gadget: 'Airjab Launcher', gadget_desc: 'Nomad’s custom rifle attachment allows her to launch Airjab repulsion grenades. They can explode midair when in close proximity to an enemy or they can stick to a surface and detonate later, again when an enemy is within range. Nomad enters the field with three Airjab grenades. These pushback devices are non-lethal but they disorient those affected.', weapons: ['.44 Mag Semi-Auto', 'AK-74M', 'ARX200', 'GONNE-6 Rev', 'PRB92'] },
    { name: 'Noor', side: 'def', icon: null, armor: '2', speed: 'medium', difficulty: null, function: ['Anti-Shield', 'Area Denial'], realname: null, birthplace: null, birthdate: null, affiliation: null, country: ['eg'], releasedate: null, gadget: 'Horus Lance Launcher', gadget_desc: '发射 5 发穿透火焰弹，可穿透护盾并进行区域封锁（Ubisoft Y11S3 官方公告）', weapons: ['1911 TACOPS', 'ALDA 5.56', 'Bailiff 410', 'Commando 9'] },
    { name: 'Nøkk', side: 'atk', icon: 'nokk.svg', armor: '2', speed: 'medium', difficulty: 'hard', function: ['Front Line', 'Map Control'], realname: 'Karina Gaarddhøje', birthplace: '[REDACTED]', birthdate: null, affiliation: '[https://en.wikipedia.org/wiki/Jaeger_Corps_(Denmark) Jægerkorpset]', country: ['dk'], releasedate: '2019-06-11', gadget: 'Hel Presence Reduction', gadget_desc: 'Counter-intel that wipes Nøkk\'s image from observation tools.', weapons: ['5.7 USG', 'D-50', 'FMG-9', 'GONNE-6', 'PMR90A2', 'SIX12 SD'] },
    { name: 'Oryx', side: 'def', icon: 'oryx.svg', armor: '2', speed: 'medium', difficulty: 'normal', function: ['Support'], realname: 'Saif Al Hadid', birthplace: '[https://en.wikipedia.org/wiki/Azraq,_Jordan Azraq]', birthdate: '1975-7-3', affiliation: null, country: [], releasedate: '2020-03-10', gadget: 'Remah Dash', gadget_desc: 'The Remah Dash is his signature move, its speed allows him to roam efficiently and cover short distances with unprecedented swiftness. It can also be used to knock down opponents, which gives him a unique way to deal with an Operator like Montagne.', weapons: ['Bailiff 410', 'Reaper MK2', 'SPAS-12', 'T-5 SMG', 'USP40'] },
    { name: 'Osa', side: 'atk', icon: 'osa.svg', armor: '3', speed: 'slow', difficulty: 'normal', function: ['Intel', 'Support'], realname: 'Anja Katarina Janković', birthplace: 'Split, Croatia', birthdate: '1994-04-29', affiliation: null, country: [], releasedate: '2021-09-07', gadget: 'Talon-8 Clear Shield', gadget_desc: 'The transparent and bulletproof Talon-8 Shield can be carried by Osa or deployed on floors or window frames, giving her a protective line of sight while she formulates an attack strategy.', weapons: ['556XI', 'PDW9', 'PMM'] },
    { name: 'Pulse', side: 'def', icon: 'pulse.svg', armor: '1', speed: 'fast', difficulty: 'hard', function: ['Intel', 'Support'], realname: 'Jack Estrada', birthplace: 'Goldsboro, North Carolina', birthdate: '1984-10-11', affiliation: 'SWAT', country: ['us'], releasedate: '2015-12-01', gadget: 'HB-5 Cardiac Sensor', gadget_desc: 'This heartbeat detector can read thermal signatures through walls and other obstacles.', weapons: ['5.7 USG', 'M1014', 'M45 MEUSOC', 'Reaper MK2', 'UMP45'] },
    { name: 'Ram', side: 'atk', icon: 'ram.svg', armor: '3', speed: 'slow', difficulty: 'normal', function: ['Breach', 'Anti-Gadget'], realname: 'Bo-Ram Choi', birthplace: 'Busan, South Korea', birthdate: '1986-04-25', affiliation: null, country: [], releasedate: '2023-08-29', gadget: 'BU-GI Auto Breacher', gadget_desc: 'Very little can stand in the way of the new BU-GI Auto Breacher. This deployable mini-tank destroys all breakable surfaces and devices in its way along a set path, leaving a trail of destruction in its wake.', weapons: ['LMG-E', 'Mk1 9mm', 'R4-C'] },
    { name: 'Rauora', side: 'atk', icon: 'rauora.svg', armor: '2', speed: 'medium', difficulty: 'normal', function: ['Support', 'Map Control'], realname: 'Hāpai Iwini', birthplace: 'Christchurch, New Zealand', birthdate: '1996-05-11', affiliation: null, country: [], releasedate: '2025-03-04', gadget: 'D.O.M. Panel Launcher', gadget_desc: 'Seize control over the map with Rauora’s D.O.M. Panel Launcher. Deploy bulletproof panels from a distance and strategically control the flow of combat. With a quick trigger at the top of the door, open or close the panel to create tactical opportunities.', weapons: ['417', 'GSH-18', 'M249', 'Reaper MK2', 'XK23'] },
    { name: 'Rook', side: 'def', icon: 'rook.svg', armor: '3', speed: 'slow', difficulty: 'easy', function: ['Support'], realname: 'Julien Nizan', birthplace: 'Tours', birthdate: '1990-01-06', affiliation: 'GIGN', country: ['fr'], releasedate: '2015-12-01', gadget: 'R1N "Rhino" Armor', gadget_desc: 'A multi-hit boron ceramic plate with a special spall-stop coating, and a back-face deformation (BFD) plate stored in a light weight sturdy satchel for rapid field deployment.', weapons: ['LFP586', 'MP5', 'P9', 'P90', 'Reaper MK2', 'SG-CQB'] },
    { name: 'Sens', side: 'atk', icon: 'sens.svg', armor: '1', speed: 'fast', difficulty: 'normal', function: ['Support', 'Map Control'], realname: 'Néon Ngoma Mutombo', birthplace: 'Brussels, Belgium', birthdate: '1992-03-03', affiliation: 'Belgian Special Forces Group (B-SFG)', country: [], releasedate: '2022-06-14', gadget: 'R.O.U. Projector System', gadget_desc: 'R.O.U. Projector System rolls after it\'s thrown by Sens and drops small projectors to create a screen along its path. Although physical objects can still pass through the screen, it\'s highly flexible—cutting off multiple lines of sight at once.', weapons: ['417', 'GONNE-6', 'POF-9', 'SDP 9mm', 'XK23'] },
    { name: 'Sentry', side: 'def', icon: 'sentry.svg', armor: '2', speed: 'medium', difficulty: 'easy', function: ['Support'], realname: null, birthplace: null, birthdate: null, affiliation: null, country: [], releasedate: '2024-06-11', gadget: null, gadget_desc: null, weapons: ['C75 Auto', 'Commando 9', 'M870', 'Super Shorty', 'TCSG12'] },
    { name: 'Skopos', side: 'def', icon: 'skopos.svg', armor: '2', speed: 'medium', difficulty: 'normal', function: ['Intel', 'Support'], realname: 'Kure Galanos', birthplace: 'Nicosia, Cyprus', birthdate: '1982-07-25', affiliation: 'Hellenic Armed Forces', country: ['gr'], releasedate: '2024-09-10', gadget: 'V10 Pantheon Shells', gadget_desc: 'With a pair of V10 Pantheon Shells, Skopós enters the battlefield in control of one as an Operator and the other as an Observation Tool protected by a reinforced shield. While she can only operate one at a time and will lose connection to both shells if one is destroyed, she can switch between them at will, making Skopós an effective intel and support Operator.', weapons: ['P229', 'PCX-33'] },
    { name: 'Sledge', side: 'atk', icon: 'sledge.svg', armor: '2', speed: 'medium', difficulty: 'easy', function: ['Breach', 'Anti-Gadget'], realname: 'Seamus Cowden', birthplace: 'John o\'Groats', birthdate: '1982-04-02', affiliation: 'S.A.S.', country: ['uk'], releasedate: '2015-12-01', gadget: 'The Caber (Tactical Breaching Hammer)', gadget_desc: 'The Breaching Hammer is capable of making doors in destructible walls and instantly destroying barricades. Additionally, the Breaching Hammer can be used as a melee weapon and to destroy barbed wire.', weapons: ['L85A2', 'M590A1', 'P226 MK 25', 'Reaper MK2', 'SMG-11'] },
    { name: 'Smoke', side: 'def', icon: 'smoke.svg', armor: '2', speed: 'medium', difficulty: 'normal', function: ['Anti-Entry', 'Trapper'], realname: 'James Porter', birthplace: 'London', birthdate: '1981-05-14', affiliation: 'S.A.S.', country: ['uk'], releasedate: '2015-12-01', gadget: 'Compound Z8 (Remote Gas Grenade)', gadget_desc: 'Throwable canister containing a toxic gas. Sticks to any surface and can be remotely detonated at will.', weapons: ['FMG-9', 'M590A1', 'P226 MK 25', 'SMG-11'] },
    { name: 'Solid Snake', side: 'atk', icon: null, armor: '1', speed: 'fast', difficulty: 'normal', function: ['Intel', 'Front Line'], realname: 'David', birthplace: 'United States', birthdate: '\'\'Redacted\'\'', affiliation: null, country: [], releasedate: '2026-03-03', gadget: 'Soliton Radar Mk. III', gadget_desc: 'Find nearby enemy threats with Solid Snake\'s Soliton Radar Mk. III, a handheld device with a minimap that marks any hostiles present. Use the device\'s precision mode to pinpoint threats, but be wary, as this will alert enemies that they\'ve been detected by Solid Snake. The Radar provides a view of immediate surroundings, making it an excellent tool for recon that allows allies to lay groundwork and take map control quickly. While hunting down enemies, Solid Snake can also scavenge gadgets from fallen Operators to adapt to the ever-changing needs of the battle.', weapons: ['F2', 'PMR90A2', 'TACIT .45'] },
    { name: 'Solis', side: 'def', icon: 'solis.svg', armor: '2', speed: 'medium', difficulty: 'hard', function: ['Intel', 'Support'], realname: 'Ana Valentina Díaz', birthplace: 'Zipaquirá, Colombia', birthdate: '1985-09-18', affiliation: 'AFEAU', country: [], releasedate: '2022-11-21', gadget: 'SPEC-IO Electro-Sensor', gadget_desc: 'The truth comes to light with Solis\' SPEC-IO Electro-Sensor, a new gadget detection device for Defense operatives. With the ability to mark and ping opponents\' electronic devices, there is nowhere to hide.', weapons: ['ITA12L', 'P90', 'SMG-11'] },
    { name: 'Striker', side: 'atk', icon: 'striker.svg', armor: '2', speed: 'medium', difficulty: 'easy', function: ['Support'], realname: null, birthplace: null, birthdate: null, affiliation: null, country: [], releasedate: '2024-06-11', gadget: null, gadget_desc: null, weapons: ['5.7 USG', 'ITA12S', 'M249', 'M4', 'SR-25'] },
    { name: 'Tachanka', side: 'def', icon: 'tachanka.svg', armor: '3', speed: 'slow', difficulty: 'easy', function: ['Anti-Entry', 'Crowd Control'], realname: 'Alexsandr Senaviev', birthplace: 'Saint Petersburg', birthdate: '1967-11-03', affiliation: 'Spetsnaz', country: ['ru'], releasedate: '2015-12-01', gadget: 'Shumikha Launcher', gadget_desc: 'Area denial heavy incendiary grenade launcher can bounce multiple times, and their fuse timer only starts after the first bounce, giving them a lot of versatility.', weapons: ['9x19VSN', 'Bearing 9', 'DP27', 'GSH-18', 'PMM'] },
    { name: 'Thatcher', side: 'atk', icon: 'thatcher.svg', armor: '3', speed: 'slow', difficulty: 'easy', function: ['Anti-Gadget', 'Support'], realname: 'Mike Baker', birthplace: 'Bideford', birthdate: '1961-06-22', affiliation: 'S.A.S.', country: ['uk'], releasedate: '2015-12-01', gadget: 'EG MKO-EMP Grenade', gadget_desc: 'Throwable Electromagnetic Pulse grenade capable of disabling most hostile electronics within a short radius, even through walls. Disabling hostile cameras for 10 seconds instead.', weapons: ['AR33', 'L85A2', 'M590A1', 'P226 MK 25', 'PMR90A2'] },
    { name: 'Thermite', side: 'atk', icon: 'thermite.svg', armor: '2', speed: 'medium', difficulty: 'easy', function: ['Breach', 'Support'], realname: 'Jordan Trace', birthplace: 'Plano, Texas', birthdate: '1982-03-14', affiliation: 'SWAT', country: ['us'], releasedate: '2015-12-01', gadget: 'Brimstone BC-3 (Exo-Thermic Charge)', gadget_desc: 'Rolling mat affixed to an incendiary device that can be remotely detonated. Capable of breaching reinforced walls.', weapons: ['5.7 USG', '556XI', 'ITA12S', 'M1014', 'M45 MEUSOC'] },
    { name: 'Thorn', side: 'def', icon: 'thorn.svg', armor: '2', speed: 'medium', difficulty: 'easy', function: ['Anti-Entry', 'Trapper'], realname: 'Brianna Skehan', birthplace: 'County Kildare, Ireland', birthdate: '1993-06-18', affiliation: '[https://en.wikipedia.org/wiki/Garda_Emergency_Response_Unit Garda Emergency Response Unit]', country: [], releasedate: '2021-11-30', gadget: 'Razorbloom Shell', gadget_desc: 'The Razorbloom Shell sticks to a surface after it\'s thrown by Thorn. Shortly after detecting a nearby opponent, it automatically propels a set of sharp blades in all directions, delivering lethal damage.', weapons: ['1911 TACOPS', 'C75 Auto', 'M870', 'UZK50GI'] },
    { name: 'Thunderbird', side: 'def', icon: 'thunderbird.svg', armor: '2', speed: 'medium', difficulty: 'easy', function: ['Support'], realname: 'Mina Sky', birthplace: '[https://en.wikipedia.org/wiki/Nakoda_(Stoney) Nakoda Teritories]', birthdate: '1985-04-01', affiliation: 'STAR-NET Aviation', country: ['ca'], releasedate: '2021-06-14', gadget: 'Kona Station', gadget_desc: 'When deployed on the ground, the Kóna Station acts as a point of safety for injured and downed Operators. All they have to do is approach the device, and the Kóna Station automatically boosts the Operator\'s HP or offers a revive.', weapons: ['Bearing 9', 'ITA12S', 'Q-929', 'SPAS-15', 'Spear .308'] },
    { name: 'Tubarão', side: 'def', icon: 'tubarao.svg', armor: '2', speed: 'medium', difficulty: 'normal', function: ['Anti-Entry', 'Anti-Gadget'], realname: 'Isaac Nunes Oliviera', birthplace: 'Ponta Delgada, Azores, Portugal', birthdate: '1988-11-24', affiliation: null, country: [], releasedate: '2023-12-06', gadget: 'Zoto Canister', gadget_desc: 'Feel the chill of the new Zoto Canister. The Zoto Canister is a throwable device that can can slow enemies, freeze devices to pause their deployment and prevent use, and even leave footprints behind if the frozen area is walked on.', weapons: ['AR-15.50', 'MPX', 'P226 MK 25'] },
    { name: 'Twitch', side: 'atk', icon: 'twitch.svg', armor: '2', speed: 'medium', difficulty: 'normal', function: ['Anti-Gadget', 'Intel'], realname: 'Emmanuelle Pichon', birthplace: 'Nancy', birthdate: '1988-10-12', affiliation: 'GIGN', country: ['fr'], releasedate: '2015-12-01', gadget: 'RSD Model 1 (Shock Drone)', gadget_desc: 'Bulkier, slower and more silent than the standard observation drone, the shock drone, holds multiple shots. It\'s capable of destroying electronic equipment as well as most electronic gadgets. It can also deal small amounts of damage to players.', weapons: ['417', 'F2', 'LFP586', 'P9', 'SG-CQB'] },
    { name: 'Valkyrie', side: 'def', icon: 'valkyrie.svg', armor: '2', speed: 'medium', difficulty: 'normal', function: ['Intel', 'Support'], realname: 'Meghan J. Castellano', birthplace: 'Oceanside', birthdate: '1986-07-21', affiliation: 'NAVY SEAL', country: ['us'], releasedate: '2016-05-10', gadget: 'Gyro Cam MK2', gadget_desc: 'Encased in a tinted silicone ball, coated in micro-suction cups, the MK2 maintains a clear view thanks to the internal gyroscope that dictates the angle of the lens. The suction cups allow the camera to adhere to any surface, while the gyroscope mounted lens stabilises the camera angle and focus. The live video feed is available to all operators.', weapons: ['D-50', 'MPX', 'SPAS-12'] },
    { name: 'Vigil', side: 'def', icon: 'vigil.svg', armor: '1', speed: 'fast', difficulty: 'hard', function: ['Anti-Gadget', 'Crowd Control'], realname: 'Chul Kyung Hwa', birthplace: null, birthdate: '1984-1-17', affiliation: '707th SMB', country: ['kr'], releasedate: '2017-12-05', gadget: 'ERC-7 (Electronic Rendering Cloak)', gadget_desc: 'Chul Kyung’s quiet lethality in the field allows him to rely on his Electronic Rendering Cloak (ERC-7) to remain undetected. The ERC-7 uses Diminished Reality technology to remove perceivable stimuli from its direct environment. Vigil carries a prototype in his backpack, which scans surrounding electronic devices and wipes his image from any cameras in view.', weapons: ['BOSG.12.2', 'C75 Auto', 'K1A', 'SMG-12'] },
    { name: 'Wamai', side: 'def', icon: 'wamai.svg', armor: '2', speed: 'medium', difficulty: 'normal', function: ['Anti-Gadget', 'Trapper'], realname: 'Ngũgĩ Muchoki Furaha', birthplace: '[https://en.wikipedia.org/wiki/Lamu Lamu]', birthdate: '1991-06-01', affiliation: null, country: [], releasedate: '2019-12-03', gadget: 'Mag-NET', gadget_desc: 'The Mag-NET System is a thrown, adhesive gadget. It sticks to surfaces and waits. Its function is to attract an opponent’s projectile to its position, and then self-destruct to detonate that projectile. This way, not only can Wamai make Attackers’ grenades and projectile gadgets useless, he can also use strategic placement to turn those projectiles against them.', weapons: ['AUG A2', 'Keratos .357', 'MP5K', 'P12', 'Super Shorty'] },
    { name: 'Warden', side: 'def', icon: 'warden.svg', armor: '3', speed: 'slow', difficulty: 'normal', function: ['Anti-Gadget', 'Intel'], realname: 'Collinn McKinley', birthplace: 'Louisville', birthdate: '1971-03-18', affiliation: 'Secret Service', country: ['us'], releasedate: '2019-06-11', gadget: 'Glance Smart Glasses', gadget_desc: 'Eyewear that improves visibility in smoke while standing still. Can also be activated to protect against or reduce flash blindness.', weapons: ['M590A1', 'MPX', 'P-10C', 'SMG-12'] },
    { name: 'Ying', side: 'atk', icon: 'ying.svg', armor: '2', speed: 'medium', difficulty: 'normal', function: ['Front Line', 'Map Control'], realname: 'Siu Mei Lin', birthplace: 'Hong Kong', birthdate: '1983-5-12', affiliation: 'S.D.U.', country: ['hk'], releasedate: '2017-09-05', gadget: 'Candela Device', gadget_desc: 'Inspired by the new breed of stun grenades showcased by the S.A.S., this mercury and magnesium based explosive creates a multitude of blinding flashes. The Candela device releases a cluster of flash charges that can either be anchored on surfaces or thrown out as a grenade.', weapons: ['Q-929', 'Reaper MK2', 'SIX12', 'T-95 LSW'] },
    { name: 'Zero', side: 'atk', icon: 'zero.svg', armor: '1', speed: 'fast', difficulty: 'easy', function: ['Anti-Gadget', 'Intel'], realname: 'Samuel Leo Fisher', birthplace: '[https://en.wikipedia.org/wiki/Baltimore Baltimore]', birthdate: '1957-8-8', affiliation: '[https://rainbowsix.fandom.com/wiki/ROS ROS]', country: [], releasedate: '2020-09-10', gadget: 'Argus Launcher', gadget_desc: 'Intel is crucial to a good attack strategy, and Zero is well aware of that. His Argus Launcher is equipped with very special cameras that can lodge themselves into breakable and reinforced surface to surveil either side.', weapons: ['5.7 USG', 'GONNE-6', 'MP7', 'SC3000K'] },
    { name: 'Zofia', side: 'atk', icon: 'zofia.svg', armor: '3', speed: 'slow', difficulty: 'easy', function: ['Anti-Gadget', 'Breach'], realname: 'Zofia Bosak', birthplace: 'Wrocław', birthdate: '1981-1-28', affiliation: 'GROM', country: ['pl'], releasedate: null, gadget: 'Withstand(Removed)', gadget_desc: 'Zofia\'s special ability to withstand allows her to revive herself for a 95% health penalty after entering the down but not out (DBNO) state. After Year 5 Season 4 patch [https://liquipedia.net/rainbowsix/5.4.3_Patch#Zofia 5.4.3], this ability has been removed from the game.', weapons: ['LMG-E', 'M762', 'RG15'] },
];

// ---- 官方更新信息 ----
const UPDATES = [
    {
        type: 'info',
        date: '2026-09-07',
        title: '新增「干员」页签 — 78 位干员档案，含图片 / 技能 / 携带武器',
        content: '<ul><li>👤 <strong>78 位干员档案</strong>（进攻 39 / 防守 39），卡片式浏览，支持阵营筛选与关键词搜索（干员名 / 技能 / 武器 / 所属单位）</li><li>🖼️ <strong>干员图片</strong>：r6operators 官方风格图标，78 位中 75 位已配图</li><li>🎯 <strong>技能</strong>：76 位有独特技能名与说明（来源 Liquipedia）；无来源的留空不估算</li><li>🔫 <strong>携带武器</strong>：由本站 WEAPONS 反查，点击武器名可直接跳转武器详情</li><li>📋 <strong>档案字段</strong>：护甲 / 速度 / 难度 / 职能 / 真名 / 出生地 / 所属单位 / 上线日期</li><li>⚠️ 数据源：GitHub hanslhansl operators.json（武器与阵营）+ Liquipedia（属性与技能）+ Ubisoft 官方公告（Noor 等新干员）</li></ul>',
        link: ''
    },
    {
        type: 'info',
        date: '2026-09-07',
        title: '武器配图刷新 — 缩略图 84→111 张，后坐力图 90→106 张',
        content: '<ul><li>🔍 <strong>深度重检索</strong>：Fandom 图片服务此前整站 503，本次复查已恢复；灰机wiki（Fandom 镜像）API 与 CDN 均可达，作为补充源</li><li>🖼️ <strong>武器渲染图</strong>：补齐 27 张（灰机命名 <code>R6S wpn &lt;武器名&gt;.png</code>），总数 84 → <strong>111</strong>；仅 Mk1 9mm / Luison / GONNE-6 Rev 三把灰机无此图</li><li>📈 <strong>后坐力图</strong>：新补 16 张（含沿袭多时的 <strong>ITA12L</strong>），总数 90 → <strong>106</strong>；PCX-33 / XK23 / Glaive-12 等灰机确无此图</li><li>✅ <strong>全量校验</strong>：217 个图片 URL 逐个 HTTP 探测，失效 0（灰机中文路径需百分号编码，已修）</li><li>🔧 <strong>取图逻辑</strong>：优先灰机渲染图，回退 Fandom，避免单一源故障导致整站缺图</li></ul>',
        link: ''
    },
    {
        type: 'info',
        date: '2026-09-07',
        title: '配件图标补齐 — 枪管 / 握把 / 下挂 9 款全部配图，配件名称对齐游戏内官方名',
        content: '<ul><li>🖼️ <strong>9 款配件 ICON 全部补齐</strong>：枪管 5（消焰器 / 补偿器 / 枪口制退器 / 消音器 / 延伸枪管）+ 握把 3（垂直前握把 / 拐角握把 / 水平前握把）+ 下挂 1（激光瞄准器），取自游戏内军械库原生截图，程序化切图、透明底，与瞄具 15 款同规格</li><li>✏️ <strong>配件名称对齐游戏内官方名</strong>：制退器 → <strong>枪口制退器</strong> / 加长枪管 → <strong>延伸枪管</strong> / 垂直握把 → <strong>垂直前握把</strong> / 转角握把 → <strong>拐角握把</strong> / 水平握把 → <strong>水平前握把</strong></li><li>📁 图标存放于 <code>images/attachments/icons/</code>，与瞄具图标（<code>images/sights/icons/</code>）分目录管理</li></ul>',
        link: ''
    },
    {
        type: 'patch',
        date: '2026-09-01',
        title: 'Y11S3 补丁笔记补遗 — TTS 期间 Bug 修复随正式版一并上线',
        content: '<ul><li>🔧 <strong>Bearing 9 / Super Shorty 机瞄修复</strong>：修复无法使用这两把武器的机械瞄具开镜瞄准的问题</li><li>🔧 <strong>水平握把修复</strong>：修复自定义枪械时无法选用水平前握把的问题</li><li>🔧 Montagne 盘石盾展开/收缩动画不流畅</li><li>🔧 Pulse 心跳传感器无法显示侦测到的敌人</li><li>🔧 AI 训练机器人：修复绕开 Azami 牙刃壁障（改为尝试破坏）、游艇地图不生成、绳降过慢</li><li>🔧 3v3 街机模式：选相同干员时对战结束崩溃</li><li>🔧 靶场多个教程目标无法完成</li><li>⚠️ <strong>无武器伤害/射速/弹匣/配件兼容性变更</strong>，纯 TTS 期间 Bug 修复</li></ul>',
        link: 'https://www.ubisoft.com/en-us/game/rainbow-six/siege/news-updates/6HzsdnbOYovXelORy4mB7z/y11s3-patch-notes-addendum'
    },
    {
        type: 'info',
        date: '2026-08-30',
        title: 'Gamescom 社区直播回顾 — Y12 起每年 4 名新干员 + 人质模式重做',
        content: '<ul><li>🆕 <strong>Y12 起每年 4 名新干员</strong>（当前 Y11 为每年 3 名），意味着更多新武器需持续跟踪</li><li>🎭 <strong>Noor 深度背景</strong>：父亲 Jamal Murrad（Unit 777，曾出现在 Rogue Spear / Raven Shield）；Ahmed 曾在赫里福德基地与埃及成长，后与 Delta Force / SAS / GIGN 联训</li><li>🎮 <strong>人质模式重做</strong>（Hostage Rework）确认开发中</li><li>💀 <strong>预告：将有一名可操作干员死亡</strong>（叙事向，暂未透露具体干员）</li><li>🌐 <strong>Rainbow Six Tactics</strong> 公布：单人回合制战术游戏，与围攻共享世界观与叙事线</li><li>⚠️ <strong>无当前版本武器/配件改动</strong>，纯未来规划与叙事向内容</li></ul>',
        link: 'https://www.ubisoft.com/en-us/game/rainbow-six/siege/news-updates/3CgEMLbWxEo0WCu5TMKXxX/gamescom-livestream-recap'
    },
    {
        type: 'patch',
        date: '2026-09-01',
        title: 'Y11S3「Operation Split Fire」正式上线 — 主表数值已落地',
        content: '<ul><li>✅ <strong>本站主表已按正式版数值更新</strong>（GitHub hanslhansl 实测 + 官方设计师笔记双源核对）</li><li>🔫 <strong>SMG-12</strong>：伤害 28→<strong>16</strong> / 弹匣 32→<strong>22</strong> / 射速 1270→1273 / 衰减重做 17-28m（28m 起 9）/ 备弹 96→78</li><li>🔫 <strong>AR-15.50</strong>：伤害 67→<strong>59</strong> / 射速 439→<strong>444</strong> / 衰减 29-40m（40m 41）/ <strong>Tubarão 不可装制退器</strong>（Maverick 保留）</li><li>🔫 <strong>Mk 14 EBR</strong>：伤害 60→<strong>56</strong> / 射速 457→<strong>444</strong> / 衰减 29-40m（40m 39）/ <strong>Aruni 不可装制退器</strong>（Dokkaebi 保留）</li><li>🔫 <strong>SPSMG9</strong>：伤害 33→<strong>35</strong> / 衰减 17-27m（27m 起 21）</li><li>🔭 <strong>CSRX 300</strong>：射速 55→<strong>63</strong> / 内置镜 5x/12x→<strong>3.5x/8x</strong> / pump 1s→0.8s / 总弹药 36→51 / 40m 109→108 / V-Lance 不再打断 ADS</li><li>🆕 <strong>新干员 Noor</strong>（防守方 2速2血，埃及）已挂载至 Commando 9 / ALDA 5.56 / 1911 TACOPS / Bailiff 410</li><li>⚠️ 新版 CSRX 倍率对应的 ADS 灵敏度乘数官方未公布，本站标注为「暂缺」而非估算</li></ul>',
        link: 'https://www.ubisoft.com/en-us/game/rainbow-six/siege/news-updates'
    },
    {
        type: 'info',
        date: '2026-09-04',
        title: '配件图鉴改版 — 卡片化 + 按军械库分类 + 逐款瞄具独立成卡',
        content: '<ul><li>🗂️ <strong>按游戏内军械库分类</strong>：瞄准镜 / 枪管 / 握把 / 下挂 四大类分区展示</li><li>🃏 <strong>卡片化</strong>：25 张卡片（16 瞄具 + 5 枪管 + 3 握把 + 1 下挂），点击任意卡片弹出详情，含完整属性、说明与适用武器清单</li><li>🔭 <strong>瞄具逐款独立成卡</strong>：15 款型号各占一卡，仅按倍率（1.0x / 2.5x / 3.5x）做分组标题，不再按类型合并</li><li>🖼️ <strong>15 款瞄具 ICON 已配图</strong>（游戏内军械库原生截图切出）；枪管/握把/下挂共 10 项暂无官方图标素材，暂以文字符号占位并标注说明</li><li>🔧 <strong>修正 3 条 Y9S1 过期配件数据</strong>：垂直握把 25%→20% / 转角握把由 -32% ADS 改为 +20% 装填 / 激光由改善腰射改为 +10% ADS</li><li>⚠️ 水平握把的移动速度增益与后坐力代价官方未公布具体数值，仅标注方向</li></ul>',
        link: 'https://www.liquipedia.net/rainbowsix/9.1.0_Patch'
    },
    {
        type: 'info',
        date: '2026-09-04',
        title: '瞄具体系重构 — 按放大倍率分大类、瞄具类型分小类',
        content: '<ul><li>🔭 <strong>修复长期数据错误</strong>：本站此前仍在使用 <strong>Y9S1 已从游戏移除</strong>的 1.5x / 2.0x / 3.0x 倍镜（分别出现 53 / 26 / 18 处），且完全缺失当前版本最高倍率 3.5x</li><li>📐 <strong>新分类</strong>：大类按放大倍率（<strong>1.0x 无放大 / 2.5x 放大镜 / 3.5x 望远镜</strong>），小类按瞄具类型（机瞄 / 红点 / 全息 / 反射 / Magnified / Telescopic）</li><li>🖼️ <strong>15 款军械库瞄具原生 ICON</strong> 已逐款接入武器详情页与配件图鉴</li><li>📋 <strong>可用性依 Y9S1 官方分配表重算</strong>：2.5x 进攻方全主武器可用、防守方仅 14 组白名单；3.5x 仅进攻方 DMR（全库 7 把）</li><li>⚠️ 29 把武器补充了干员级可用性说明（如「2.5x 仅 Doc/Melusi/Rook 可用」）</li><li>ℹ️ 机瞄 +10% ADS 速度、非放大瞄具 +5%，均为 Y9S1 引入</li></ul>',
        link: 'https://www.liquipedia.net/rainbowsix/9.1.0_Patch'
    },
    {
        type: 'designer',
        date: '2026-08-17',
        title: 'Y11S3 设计师笔记 — 武器/配件/干员平衡完整详解',
        content: '<ul><li>🔫 <strong>SMG-12 大幅削弱</strong>：damage 28→<strong>16</strong> / mag 32→<strong>22</strong> / 总弹药 129→111（影响 Dokkaebi/Vigil/Warden）</li><li>🔫 <strong>AR-15.50 削弱</strong>：damage 67→<strong>59</strong> / 首发后坐力↑ / <strong>Tubarão 移除制退器</strong>（影响 Maverick/Tubarão）</li><li>🔫 <strong>Mk 14 EBR 削弱</strong>：damage 60→<strong>56</strong> / 首发后坐力↑ / <strong>Aruni 移除制退器</strong>（影响 Aruni/Dokkaebi）</li><li>🔫 <strong>SPSMG9 加强</strong>：damage 33→<strong>35</strong>（影响 Clash/Kali）</li><li>🔫 <strong>CSRX 300 大改</strong>：瞄具 5x/12x→3.5x/8x / pump 1s→0.8s / 总弹药 36→51 / 后坐力↑ / 腰射散布↑ / V-Lance 不再取消 ADS</li><li>⚔️ <strong>Dokkaebi</strong>：Jegeo Payload 须持续连接+可被打断 / EMP→破门炸药 / 平板全程可探测</li><li>⚔️ <strong>Lion</strong>：EE-ONE-D 预警 1.5s→1.4s</li><li>⚔️ <strong>Echo</strong>：Sonic Burst 充能 16s→15s</li><li>⚔️ <strong>Kapkan</strong>：EDD 伤害 60→62</li><li>💣 <strong>Claymore</strong>：伤害 150→155</li><li>📊 基于 Y11S2.3 白金+段位数据：进攻端 Ace Ban 率最高（PC 48%/主机 63%）；防守端 Mira 89%</li><li>⚠️ 配件移除为<strong>干员特定</strong>：制退器移除仅限 Aruni(MK14) 和 Tubarão(AR-15.50)，其他使用者保留</li><li>⚠️ 以上为 TTS 阶段内容，<strong>9/1 正式上线后录入 WEAPONS 主表</strong></li></ul>',
        link: 'https://www.ubisoft.com/en-us/game/rainbow-six/siege/news-updates/PONCuRt8LaCr3O31NkBQb/y11s3-designers-notes'
    },
    {
        type: 'designer',
        date: '2026-08-15',
        title: 'Y11S3 "Operation Split Fire" 赛季公布 — TTS 8/17 开放',
        content: '<ul><li>🆕 <strong>新干员 Noor</strong>（防守方 2速2血，埃及）：Horus Lance Launcher 穿透火焰弹×5，反盾+区域封锁。主武器 Commando 9 / Alda 5.56，副武器 1911 TACOPS / Bailiff 410</li><li>🔫 <strong>SMG-12 大幅削弱</strong>：damage 28→<strong>16</strong> / mag 32→<strong>22</strong> / 总弹药 129→111</li><li>🔫 <strong>AR-15.50 削弱</strong>：damage 67→<strong>59</strong> / 增加后坐力 / <strong>移除制退器</strong></li><li>🔫 <strong>Mk 14 EBR 削弱</strong>：damage 60→<strong>56</strong> / <strong>移除制退器</strong></li><li>🔫 <strong>SPSMG9 加强</strong>：damage 33→<strong>35</strong></li><li>🔫 <strong>CSRX 300 (Kali) 大改</strong>：瞄具 5x/12x→<strong>3.5x/8x</strong> / pump time 1s→0.8s / 总弹药 36→51 / 弹道痕迹 2s→1s / V-Lance 不再打断 ADS</li><li>⚔️ <strong>Dokkaebi</strong>：EMP→破门炸药 / Jegeo Payload 可被打断（Mute/击杀/Tubarão）/ 平板须持续激活</li><li>⚔️ <strong>Lion</strong>：EE-ONE-D 预警 1.5s→1.4s</li><li>⚔️ <strong>Echo</strong>：Sonic Burst 充能 16s→15s</li><li>⚔️ <strong>Kapkan</strong>：EDD 伤害 60→62</li><li>⚔️ <strong>Claymore</strong>：伤害 150→155</li><li>🗺️ <strong>Villa 定向地图更新</strong>：客厅/图书馆炸弹点移至地下室 + 车库内化</li><li>🎮 <strong>3v3 Arcade</strong> (9/8-21) / <strong>Wasteland Circuit 无人机竞速</strong> (9/23-10/13) / <strong>传奇段位</strong>（赛季中）</li><li>⚠️ 上述武器数值为 TTS 确认值，<strong>9/1 正式上线后录入主表</strong></li></ul>',
        link: 'https://news.ubisoft.com/en-us/article/4qqpGJZSWrrS3Ko2hYvviK/rainbow-six-siege-operation-split-fire-new-operator-noor-3v3-arcade-mode-wasteland-circuit-event-and-more'
    },
    {
        type: 'info',
        date: '2026-08-07',
        title: 'Community Checkpoint #4 — 反作弊升级 & Y11S3 平衡预告',
        content: '<ul><li>🛡️ <strong>R6 Shieldguard Secure Platform</strong>：Legend Division 起强制 Secure Boot + TPM 2.0 + VBS/HVCI</li><li>🛡️ <strong>内核级反作弊</strong>：育碧安全团队跨游戏共享内核级方案，Siege 为首批接入</li><li>🛡️ <strong>反后坐力宏检测</strong>：全新模型检测脚本/程序宏，PC 端本月上线</li><li>⚔️ <strong>Y11S3 平衡预告</strong>：SMG-12 伤害+弹匣↓ / Mk14 EBR & AR-15.50 伤害<60+移除制退器 / Dokkaebi Jegeo 可打断</li><li>📋 <strong>核心规则更新</strong>：明确作弊/小号/代练/代挂等违规行为制裁标准</li><li>⚠️ <strong>无当前版本武器/配件改动</strong>，以上为 Y11S3 预告</li></ul>',
        link: 'https://www.ubisoft.com/en-us/game/rainbow-six/siege/news-updates/4ganHVRdfyH4WcxMwGpotZ/rainbow-six-siege-community-checkpoint-recap-core-rules-legend-division-balancing-updates-player-protection'
    },
    {
        type: 'patch',
        date: '2026-08-04',
        title: 'Y11S2.3 补丁 (Update 3.45)',
        content: '<ul><li>🔫 <strong>Reaper MK2 后坐力优化</strong>：后坐力阶段启动延后至第0/3/10/25发（原 0/3/7/13），连续射击更易控制（键鼠+手柄）</li><li>⚔️ <strong>Oryx</strong>：冲锋充能 8s→5s</li><li>⚔️ <strong>Hibana</strong>：X-Kairos 引爆计时 4s→3.8s</li><li>⚔️ <strong>Maverick</strong>：突破火焰燃料144→160（总量 288→320）</li><li>⚔️ <strong>Fuze</strong>：加固面板突破时间 2s→1.75s</li><li>⚔️ <strong>Tubarão</strong>：液氮罐范围 3m→3.2m</li><li>⚔️ <strong>Mute</strong>：信号干扰范围 2.475m→2.6m</li><li>🔧 <strong>电磁脉冲手雷</strong>：范围 1.8m→2m</li><li>🔧 修复：Chalet阳台攀爬异常、Villa 室外检测错误、Roc Shield 判定偏大等</li><li>⚠️ <strong>无武器伤害/射速/弹匣/配件兼容性变更</strong>，仅 Reaper MK2 后坐力形态优化 + 干员技能微调</li></ul>',
        link: 'https://www.ubisoft.com/en-us/game/rainbow-six/siege/news-updates/2EIn06EmkAIG7su2fpITue/y11s23-patch-notes'
    },
    {
        type: 'patch',
        date: '2026-07-23',
        title: 'Y11S2.2 热修复 (Update 1.000.149)',
        content: '<ul><li>🔧 <strong>Rook 重新启用</strong>：修复拾取护甲导致玩家卡住的恶意利用问题</li><li>🔧 修复 Villa 地图 EXT Garage 区域防守方未被正确检测为室外的问题</li><li>🔧 修复 PC & Console 匹配池分配错误，部分玩家被错误放入跨平台对战池</li><li>⚠️ <strong>无武器/配件数值变更</strong>，纯稳定性与 Bug 修复热修补</li></ul>',
        link: 'https://updatecrazy.com/rainbow-six-siege-r6-update-1-000-149-patch-notes-for-ps5-xsx'
    },
    {
        type: 'designer',
        date: '2026-07-14',
        title: 'Y11S2.2 设计师笔记 — 中期更新平衡详解',
        content: '<ul><li>⚔️ <strong>Wamai 大幅加强</strong>：MAG-NET 充能 40s→20s、最大数量 6→7、激活时间 1.5s→0.5s + 新增可部署护盾 + C4 替换冲击手雷</li><li>⚔️ <strong>Dokkaebi</strong>：Jegeo Payload 冷却改为<strong>按目标计算</strong>，冷却 7s→14s</li><li>⚔️ <strong>Jäger 回归 3速1血</strong>：强调机动性，与 Wamai 差异化定位</li><li>⚔️ <strong>Zofia</strong>：KS79 眩晕弹/破片弹各 2→3 发</li><li>🔫 <strong>416-C 后坐力大改</strong>：降低全阶段垂直 + 平滑水平 + 最难控段从第 8 发推迟到第 10 发并整体柔化</li><li>🔧 <strong>Rauora</strong>：D.O.M. 面板射击间隔 3s→1s</li><li>🔧 <strong>Melusi</strong>：Banshee 范围 4m→4.3m</li><li>🔧 <strong>Twitch</strong>：电击无人机充能 30s→28s</li><li>🔧 <strong>Lesion</strong>：蛊针地雷充能 30s→25s</li><li>⚠️ 本次补丁<strong>无武器伤害/射速/弹匣变更</strong>，仅后坐力+干员技能调整</li></ul>',
        link: 'https://www.ubisoft.com/en-us/game/rainbow-six/siege/news-updates/77rztlEyeqhZVqROCW0ZV7/designers-notes-y11s22-midseason-update'
    },
    {
        type: 'patch',
        date: '2026-07-14',
        title: 'Y11S2.2 中期补丁',
        content: '<ul><li>🖱️ <strong>主机键鼠支持</strong>：主机端原生支持键鼠输入，仅限 PC 跨平台对战池</li><li>⚔️ <strong>Wamai 大幅加强</strong>：MAG-NET 充能频率 40s→20s、最大数量 7、激活 0.5s + 可部署护盾 + C4</li><li>⚔️ <strong>Dokkaebi</strong>：Jegeo Payload 冷却改为按目标计算，14s（原全局 7s）</li><li>⚔️ <strong>Jäger</strong>：回归 3速1血</li><li>⚔️ <strong>Zofia</strong>：KS79 眩晕/破片弹各增至 3 发</li><li>🔫 <strong>416-C 后坐力改善</strong>：降低垂直 + 平滑水平 + 最难控段推迟到第 10 发</li><li>🔧 Rauora D.O.M. 面板间隔 3s→1s | Melusi Banshee 范围 4→4.3m</li><li>🔧 Twitch 电击充能 30s→28s | Lesion 蛊针充能 30s→25s</li><li>🎮 <strong>1v1 炸弹回归</strong>：新增海岸线/领事馆/荒野前哨，移除别墅，干员消耗制</li><li>🔧 修复：Mute 干扰器影响 XK23 瞄具、XK23 换弹动画异常</li></ul>',
        link: 'https://www.ubisoft.com/en-us/game/rainbow-six/siege/news-updates/3IoMKS8f3AHlOwBQXfiytt/y11s22-midseason-patch-notes'
    },
    {
        type: 'patch',
        date: '2026-07-02',
        title: 'Y11S2.1 热修复 (Update 3.42)',
        content: '<ul><li>🔧 修复多个影响 Siege Cup 的问题</li><li>🔧 游戏性能优化与 minor gameplay tweaks</li><li>🔊 修复多个语音聊天问题</li><li>🔧 稳定性修复</li><li>⚠️ <strong>无武器/配件数值变更</strong>，纯稳定性与 Bug 修复补丁</li></ul>',
        link: 'https://updatecrazy.com/rainbow-six-siege-update-3-42-patch-notes-r6-y11s2-1-hotfix/'
    },
    {
        type: 'info',
        date: '2026-06-30',
        title: 'Marketplace 经济改革公告 & 社区沟通会回顾',
        content: '<ul><li>💰 <strong>Marketplace 持续关闭</strong>：因安全与经济问题需重建基础架构，短期内不会重开</li><li>💰 <strong>S3 经济变化</strong>：新活动包转为 R6 Credits 专用，大师级物品可直接购买</li><li>📢 <strong>社区沟通会 (6/29)</strong>：Ranked 3.0 调整进展、定位赛权重提升计划</li><li>⚔️ <strong>Dokkaebi 平衡路线图</strong>：Y11S2.2 将引入"单目标冷却"系统（per-target cooldown）；Y11S3 改为信号系统（Mute/Tubarao 可反制）</li><li>🗺️ <strong>1v1 Playlist 回归</strong>：扩展至5张地图，新增消耗系统取代干员 Ban</li><li>⚠️ <strong>无武器/配件数值变更</strong></li></ul>',
        link: 'https://www.ubisoft.com/en-us/game/rainbow-six/siege/news-updates/2zwh7ZaIjBDbw9j8rBBfZM/marketplace-economy-a-new-direction'
    },
    {
        type: 'patch',
        date: '2026-06-23',
        title: 'Y11S2.1 中期补丁',
        content: '<ul><li>⚔️ <strong>Dokkaebi</strong>：Jegeo Payload 新增 7 秒冷却时间</li><li>🔧 <strong>Sens</strong>：R.O.U. 投影系统电池时长 13s→15s</li><li>🔧 <strong>IQ</strong>：电子设备侦测器范围 20m→22m</li><li>🔧 <strong>Ash</strong>：爆破弹伤害范围 2m→2.2m</li><li>🔧 <strong>Finka</strong>：肾上腺素冷却 20s→18s</li><li>🔧 <strong>Thatcher</strong>：EMP 效果范围 1.75m→1.85m</li><li>🔧 <strong>Thorn</strong>：剃刀花瓣命中跛行 15s→10s</li><li>🔫 <strong>SC3000K 后坐力平滑</strong>：水平后坐力在全 burst 阶段更平滑（键鼠+手柄）</li><li>🔧 <strong>防弹摄像头</strong>：EMP 飞镖爆炸范围 0.55m→0.75m</li><li>⚠️ 本次补丁<strong>无武器伤害/射速/弹匣变更</strong>，仅干员技能微调+后坐力平滑</li></ul>',
        link: 'https://www.ubisoft.com/en-us/game/rainbow-six/siege/news-updates/7tAny5W9p4yrHmIiH51noI/y11s21-patch-notes'
    },
    {
        type: 'patch',
        date: '2026-06-02',
        title: 'Y11S2 补丁说明附录 — 测试服修复内容',
        content: '<ul><li>📋 本附录涵盖 Y11S2 测试服期间修复的<strong>Bug</strong>，无武器/配件数值变更</li><li>🔧 修复：掉落手机异常闪光、非 Solid Snake 进攻方可拾取 OSP 包、要塞浴缸拆弹器无法交互等游戏机制问题</li><li>🔊 修复：多组干员间缺少语音对话、破坏音效缺失、双侧身键音频失真</li><li>🖥️ 修复：AI 队友标记触发反刷屏警告、阔剑挑战无法解锁、多个精英皮肤过亮等 UX 问题</li><li>⚠️ <strong>武器数值确认</strong>：XK23（49伤/675射速/35弹匣）、AK-74M 三握把等设计师笔记内容均按原设计上线，无修改</li></ul>',
        link: 'https://www.ubisoft.com/en-gb/game/rainbow-six/siege/news-updates/5wSBB6xoqdH6slG1Pr3mbA/y11s2-patch-notes-addendum'
    },
    {
        type: 'designer',
        date: '2026-05-18',
        title: 'Y11S2 设计师笔记 — 武器/配件/干员平衡详情',
        content: '<ul><li>🔫 <strong>新武器 XK23</strong>（突击步枪/无托）：49伤害 / 675射速 / 35弹匣，可装<strong>加长枪管</strong>（伤害提升至54），分配给 Dokkaebi、Rauora、Sens</li><li>🔧 <strong>AK-74M 新增握把</strong>：垂直握把、转角握把、水平握把（影响 Nomad、Deimos）</li><li>🆕 <strong>Dokkaebi 重制</strong>：Jegeo Payload 新技能，手机未重置将爆炸（40HP+火焰），摄像头入侵改为限时20s</li><li>⚔️ <strong>Zofia</strong>：回归 2速2血</li><li>⚔️ <strong>Gridlock</strong>：TRAX 踩踏造成10s跛行，尖刺血量 1→35HP，数量 4→3</li><li>⚔️ <strong>Nomad</strong>：Airjab 检测范围 3m→3.25m</li><li>⚔️ 精调：Deimos 追踪延迟 5s→4s / Mozzie 捕获范围 1.5m→1.75m / Pulse 扫描 9m→10.5m / Solis SPEC-IO 15s→17s</li><li>📅 随 Operation System Override 于 <strong>2026年6月2日</strong> 上线</li></ul>',
        link: 'https://www.ubisoft.com/en-us/game/rainbow-six/siege/news-updates/2MNhboDBmsQKkWb5p8zqsg/y11s2-designers-notes'
    },
    {
        type: 'season',
        date: '2026-06-02',
        title: 'Y11S2 Operation System Override — 正式上线',
        content: '<ul><li>🆕 <strong>Dokkaebi 重制</strong>：新技能 Jegeo Payload 替代 Logic Bomb，可对单个目标手机植入恶意软件，未挂断将造成 40HP 爆炸伤害+火焰效果</li><li>🔫 <strong>新武器 XK23</strong>（突击步枪/无托）：49伤害/675射速/35发弹匣，可用于 Dokkaebi、Rauora、Sens</li><li>🔧 <strong>AK-74M 新增握把</strong>：水平握把、垂直握把、转角握把（影响 Nomad、Deimos）</li><li>⚔️ <strong>Zofia</strong>：改为 2血2速（原 3血1速）</li><li>⚔️ <strong>Gridlock</strong>：Trax 踩中后造成 10s 跛行，尖刺血量 1→35HP，数量 4→3 个</li><li>⚔️ <strong>Mozzie</strong>：捕获距离 1.5m→1.75m | <strong>Pulse</strong>：扫描距离 9m→10.5m</li><li>⚔️ <strong>Solis</strong>：SPEC-IO 持续时间 15s→17s | <strong>Deimos</strong>：DeathMARK 等待时间 5s→4s</li><li>🗺️ <strong>Calypso Casino 新地图</strong>（致敬 Rainbow Six: Vegas）+ Emerald Plains/Kanal/Outback 视觉升级</li><li>🏆 <strong>Ranked 3.0</strong>：移除隐藏 MMR，新增 Champion I-V，5场定级赛</li><li>📅 <strong>2026年6月2日</strong> 已正式上线</li></ul>',
        link: 'https://www.ubisoft.com/en-us/game/rainbow-six/siege/news-updates/seasons/systemoverride'
    },
    {
        type: 'patch',
        date: '2026-05-05',
        title: 'Y11S1.3 中期补丁',
        content: '<ul><li>🔫 <strong>AUG A2 后坐力降低</strong>：降低垂直后坐力（PC &amp; 主机），影响 IQ、Wamai</li><li>🔫 <strong>M762 后坐力降低</strong>：降低水平后坐力（仅PC），影响 Zofia</li><li>🔫 <strong>SPEAR .308 后坐力降低</strong>：降低首发上跳+垂直后坐力（PC &amp; 主机），影响 Finka、Thunderbird</li><li>🔧 <strong>Caveira</strong>：静步持续时间 12s→15s</li><li>🔧 <strong>Vigil</strong>：ERC-7 持续时间 12s→15s</li><li>🔧 <strong>Warden</strong>：智能眼镜持续时间 20s→22s</li><li>🔧 <strong>Kaid</strong>：电爪激活时间 4s→3.5s</li><li>🔧 <strong>Zero</strong>：Argus 激光恢复时间 15s→12s</li><li>⚠️ 本次补丁<strong>无武器伤害/配件变更</strong>，仅后坐力微调</li></ul>',
        link: 'https://www.ubisoft.com/en-us/game/rainbow-six/siege/news-updates/4QxsAbVufpV8j2TCybpb5Z/y11s13-patch-notes'
    },
    {
        type: 'patch',
        date: '2026-04-14',
        title: 'Y11S1.2 中期补丁',
        content: '<ul><li>🔧 <strong>Rauora 重做级增强</strong>：D.O.M. 面板发射器射程 15m→25m，触发开启时间 1s→0.5s，敌方开关面板 3s→6s，回合开始即拥有全部4发弹药</li><li>🔧 <strong>Jackal 增强</strong>：Eyenox 可穿破损天花板从下方扫描脚印，新增<strong>破片手雷</strong></li><li>🔧 <strong>Smoke</strong>：新增<strong>可部署护盾</strong></li><li>🔧 Clash 电击持续时间 10s→15s</li><li>🔧 Frost 夹子跛行时间 60s→70s</li><li>🔧 Glaz 翻转瞄准镜畸变时间 12s→15s</li><li>🔧 Grim 蜂群罐投放延迟 0.4s→0.6s</li><li>🔧 Thunderbird 治疗速率 2HP/s→3HP/s</li><li>⚠️ 本次补丁<strong>无武器伤害/配件变更</strong></li></ul>',
        link: 'https://www.ubisoft.com/en-us/game/rainbow-six/siege/news-updates/ivbm7sXcU7iG89d7wQtlx/y11s12-patch-notes'
    },
    {
        type: 'designer',
        date: '2026-04-13',
        title: 'Y11S1.2 设计师笔记',
        content: '<ul><li><strong>Rauora</strong>：全面重做——射程/充能/面板交互时间大幅优化，定位转为即时区域控制</li><li><strong>Jackal</strong>：追踪能力垂直扩展（天花板扫描）+破片手雷提升爆破能力</li><li><strong>Smoke</strong>：可部署护盾回归，强化据点拒止能力</li><li><strong>Clash/Frost/Thunderbird</strong>：小幅增强各自核心功能</li><li><strong>Grim</strong>：蜂群罐投放略微削弱，给对手更多反应时间</li><li>⚠️ 本次设计师笔记<strong>不涉及武器数值或配件调整</strong></li></ul>',
        link: 'https://www.ubisoft.com/en-us/game/rainbow-six/siege/news-updates/1BeSepQg8hbZDRVfQ9KqDQ/y11s12-designers-notes'
    },
    {
        type: 'patch',
        date: '2026-03-24',
        title: 'Y11S1.1 中期补丁',
        content: '<ul><li><strong>M12 伤害提升</strong>：40 → 42 (Caveira)</li><li><strong>POF-9 伤害提升</strong>：35 → 37 (Sens)</li><li>Flores 遥控炸弹退出延迟 2s → 1s</li><li>Iana 全息复制持续时间 15s → 18s</li><li>Jäger 主动防御冷却 10s → 9s</li><li>Nøkk HEL持续时间 10s → 13s</li><li>Rook 护甲额外HP 20 → 25</li><li>Wamai 磁力激活时间 2s → 1.5s</li></ul>',
        link: 'https://www.ubisoft.com/en-us/game/rainbow-six/siege/news-updates/1e0rA6EwYGMNvMTSM9hmTA/y11s11-patch-notes'
    },
    {
        type: 'patch',
        date: '2026-03-03',
        title: 'Y11S1 Operation Silent Hunt — 新赛季',
        content: '<ul><li>🆕 <strong>新干员 Solid Snake</strong>（进攻方3速1血）：主武器 F2/PMR90A2，技能 Soliton Radar + 战场拾取系统</li><li>🔧 <strong>F2 新增握把</strong>：垂直握把、转角握把、水平握把（原仅有垂直握把）</li><li>🆕 <strong>Flores 获得 T-95 LSW</strong> 轻机枪作为额外主武器选项</li><li>🛡️ 盾牌干员无法冲刺穿过未破坏路障</li><li>📍 观察阻断器部署时间 2.5s → 1s</li><li>🗺️ 海岸线/别墅/俄勒冈地图翻新</li></ul>',
        link: 'https://www.ubisoft.com/en-us/game/rainbow-six/siege/news-updates'
    },
    {
        type: 'designer',
        date: '2026-02-16',
        title: 'Y11S1 设计师笔记',
        content: '<ul><li><strong>Skopós 重做</strong>：速度 2→3，血量 2→1，切换冷却 3s→0.5s，近战改为Aruni式拳击</li><li><strong>F2 配件扩展</strong>：新增垂直/转角/水平握把，提升操控性（影响 Twitch、Solid Snake）</li><li><strong>Flores</strong>：新增 T-95 LSW 轻机枪选项</li><li><strong>Ela</strong>：Grzmot 震荡持续时间 7s→9s</li><li><strong>Amaru</strong>：Garra Hook 次数 4→5</li><li><strong>Ying</strong>：Candela 闪光时间 1.4s→1.6s</li><li><strong>Alibi</strong>：Prisma 最后 Ping 不再提前消失</li></ul>',
        link: 'https://www.ubisoft.com/en-us/game/rainbow-six/siege/news-updates/5fWCjoCU8toUJiBdMSj0UA/y11s1-designers-notes'
    },
    {
        type: 'balance',
        date: '2026-01',
        title: 'Y10S4.2 平衡调整',
        content: '<ul><li>Thorn 干员平衡调整</li><li>Bug 修复和质量优化</li></ul>',
        link: 'https://www.ubisoft.com/game/rainbow-six/siege/news-updates'
    },
    {
        type: 'patch',
        date: '2025-12',
        title: 'Y10S4.1 — 肢体伤害回滚',
        content: '<ul><li><strong>肢体伤害回滚</strong>：恢复围攻X之前的肢体伤害倍率</li><li>社区长达数月的呼吁终于得到回应</li><li>间接削弱盾牌干员（四肢受伤恢复正常意味着盾牌暴露的四肢更脆弱）</li></ul>',
        link: 'https://www.ubisoft.com/game/rainbow-six/siege/news-updates'
    },
    {
        type: 'designer',
        date: '2025-09',
        title: 'Y10S3 Operation High Stakes — 武器配件重大变更',
        content: '<ul><li>🔴 <strong>防守方倍镜全面移除</strong>：所有防守方自动武器不再可装备 >1x 放大倍镜</li><li>🔴 <strong>Blackbeard 全面削弱</strong>：MK17弹匣25→20，ADS恢复0.5s→0.9s</li><li>🟢 <strong>Reaper MK2 强化并分发</strong>：分配给 Oryx/Pulse/Rook/Sledge/Ying</li><li>🔄 副武器霰弹枪重新分配：Fenrir失去Bailiff 410，Wamai获得Super Shorty</li><li>🛡️ 盾牌干员投掷手雷时盾牌不再提供保护</li></ul>',
        link: 'https://www.ubisoft.com/game/rainbow-six/siege/news-updates'
    },
    {
        type: 'patch',
        date: '2025-06',
        title: 'Y10S2 围攻X — 十周年大改',
        content: '<ul><li><strong>肢体伤害削弱</strong>：命中手臂和腿部的伤害降低（后于Y10S4.1回滚）</li><li>游戏整体翻新：UI、排名系统、地图等全方位更新</li><li>对武器手感和战斗节奏产生深远影响</li></ul>',
        link: 'https://www.ubisoft.com/game/rainbow-six/siege/news-updates'
    },
    {
        type: 'designer',
        date: '2022-08',
        title: 'Y7S3 — 配件系统大重做（里程碑）',
        content: '<ul><li>✅ <strong>消音器移除伤害惩罚</strong></li><li>✅ <strong>全武器垂直后坐力上调</strong>（PC端）</li><li>✅ 大量武器获得新枪管/握把/瞄准镜选项</li><li>✅ 激光瞄准器全面普及</li><li>核心理念：增加后坐力，让枪管配件选择变成有意义的策略决策</li></ul>',
        link: 'https://www.ubisoft.com/game/rainbow-six/siege/news-updates'
    }
];
