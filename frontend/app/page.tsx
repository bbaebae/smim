'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './landing.module.css'

export default function LandingPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleContact(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#fbf9f8', color: '#1b1c1c' }}>
      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <a href="#" className={styles.navLogo}>
            <div className={styles.navLogoMark}>
              <Image src="/logo.png" alt="스밈" width={24} height={24} style={{ objectFit: 'contain' }} />
            </div>
            <span className={styles.navLogoText}>스밈</span>
          </a>
          <div className={styles.navLinks}>
            <a href="#features" className={styles.navLinksItem}>기능</a>
            <a href="#how" className={styles.navLinksItem}>사용 방법</a>
            <a href="#pricing" className={styles.navLinksItem}>가격</a>
            <a href="#contact" className={styles.navLinksItem}>문의</a>
          </div>
          <div className={styles.navActions}>
            <Link href="/login" className={styles.btnGhost}>로그인</Link>
            <Link href="/signup" className={styles.btnPrimary}>무료로 시작</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroGrid}>
            {/* Left: heading */}
            <div>
              <div className={styles.heroBadge}>
                <span className={styles.heroBadgeDot} />
                읽은 것을 진짜 기억으로 — Second Brain
              </div>
              <h1 className={styles.heroH1}>
                정보는 쏟아지는데<br />
                <em className={styles.heroH1Em}>기억에 남는 건 없나요?</em>
              </h1>
              <p className={styles.heroSub}>
                한 번 읽고 잊어버리고, "나중에 봐야지" 하다 결국 안 보게 되는 악순환.<br />
                스밈이 AI 요약과 과학적 복습 알고리즘으로 지식을 진짜 기억으로 만들어드립니다.
              </p>
            </div>
            {/* Right: stats + CTAs */}
            <div className={styles.heroRight}>
              <div className={styles.heroStatsCol}>
                <div className={styles.heroStatItem}>
                  <div className={styles.heroStatVal}>60%<span style={{ fontSize: 14, color: '#136299' }}>↑</span></div>
                  <div className={styles.heroStatLabel}>기억 보유율 향상</div>
                </div>
                <div className={styles.heroStatDivider} />
                <div className={styles.heroStatItem}>
                  <div className={styles.heroStatVal}>2주</div>
                  <div className={styles.heroStatLabel}>평균 기억 정착 기간</div>
                </div>
                <div className={styles.heroStatDivider} />
                <div className={styles.heroStatItem}>
                  <div className={styles.heroStatVal}>5종</div>
                  <div className={styles.heroStatLabel}>콘텐츠 유형 지원</div>
                </div>
              </div>
              <div className={styles.heroCtas}>
                <Link href="/signup" className={styles.btnHero}>
                  무료로 시작하기 →
                </Link>
                <a href="#how" className={styles.btnHeroGhost}>
                  작동 방식 보기
                </a>
              </div>
            </div>
          </div>
          {/* Mock UI */}
          <div className={styles.heroMockOuter}>
            <div className={styles.heroMock}>
              {/* 이번 달 저장 */}
              <div className={styles.mockCard} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className={styles.mockLabel}>이번 달 저장</div>
                  <div className={styles.mockBig}>247</div>
                  <div style={{ fontSize: 12, color: '#136299', fontWeight: 600, marginTop: 4 }}>↑ 23% 지난달 대비</div>
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 10 }}>
                  <span className={`${styles.mockChip} ${styles.chipBlue}`}>📄 아티클</span>
                  <span className={`${styles.mockChip} ${styles.chipBlue}`}>🎬 YouTube</span>
                  <span className={`${styles.mockChip} ${styles.chipBlue}`}>📎 파일</span>
                </div>
              </div>
              {/* 최근 저장 */}
              <div className={styles.mockCard} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className={styles.mockLabel}>최근 저장</div>
                <div style={{ display: 'flex', gap: 9 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: '#efeded', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>🎬</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1b1c1c', lineHeight: 1.3 }}>Y Combinator — 스타트업 아이디어를 찾는 방법</div>
                    <div style={{ fontSize: 10, color: '#767683', marginTop: 2 }}>비즈니스/마케팅 · 방금 전</div>
                  </div>
                </div>
                <div style={{ background: '#f5f3f3', borderRadius: 8, padding: '9px 11px', fontSize: 11, color: '#454651', lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 600, color: '#136299' }}>AI 요약:</span> 좋은 아이디어는 자신이 직접 겪은 문제에서 나온다.
                </div>
              </div>
              {/* 오늘의 복습 */}
              <div className={`${styles.mockCard} ${styles.mockCardDark}`} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className={`${styles.mockLabel} ${styles.mockLabelLight}`}>오늘의 복습</div>
                  <div className={styles.mockBig} style={{ color: '#fff', fontSize: 32 }}>3개</div>
                  <div style={{ fontSize: 10, color: 'rgba(187,195,255,0.75)', marginTop: 2 }}>대기 중</div>
                </div>
                <div style={{ display: 'flex', gap: 5, marginTop: 10 }}>
                  <button className={styles.mockRbtn} style={{ background: '#ffdbc8', color: '#321300' }}>잊었음</button>
                  <button className={styles.mockRbtn} style={{ background: '#cfe5ff', color: '#001d33' }}>희미함</button>
                  <button className={styles.mockRbtn} style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}>기억남</button>
                </div>
              </div>
              {/* 주간 복습률 */}
              <div className={styles.mockCard}>
                <div className={styles.mockLabel} style={{ marginBottom: 10 }}>주간 복습률</div>
                {[['기술', 82, '#132175'], ['비즈니스', 61, '#136299'], ['투자', 45, '#bbc3ff']].map(([label, pct, color]) => (
                  <div key={label as string} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                    <span style={{ fontSize: 10, fontWeight: 500, color: '#454651', width: 48, flexShrink: 0 }}>{label}</span>
                    <div style={{ flex: 1, height: 5, background: '#e4e2e2', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: color as string, borderRadius: 99 }} />
                    </div>
                    <span style={{ fontSize: 10, color: '#767683', width: 26, textAlign: 'right' }}>{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className={`${styles.section} ${styles.featuresBg}`}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionBadge}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>auto_awesome</span>
            핵심 기능
          </div>
          <h2 className={styles.sectionH2}>지식을 스며들게 하는<br />모든 것이 여기에</h2>
          <p className={styles.sectionSub}>저장부터 복습까지, URL 하나로 지식 관리의 전 과정이 자동화됩니다.</p>

          <div className={styles.bento}>
            {/* AI Summary — col7 row2 */}
            <div className={`${styles.bentoCard} ${styles.indigoCard} ${styles.col7} ${styles.row2}`}>
              <div className={`${styles.bentoIconWrap} ${styles.iconLight}`} style={{ fontSize: 18 }}>✦</div>
              <div className={`${styles.bentoTitle} ${styles.bentoTitleLight}`} style={{ fontSize: 20 }}>Claude AI 자동 요약·분류</div>
              <div className={`${styles.bentoDesc} ${styles.bentoDescLight}`} style={{ marginTop: 6 }}>
                URL 하나만 넣으면 AI가 본문을 추출하고 핵심을 3줄로 요약합니다. 카테고리와 태그도 자동.
              </div>
              <div style={{ marginTop: 14, background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(255,255,255,0.14)' }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: 'rgba(187,195,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>AI 요약 결과</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>에빙하우스 망각 곡선에 따르면 기억은 <span style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 3, padding: '1px 5px' }}>24시간 내 70%</span> 소멸. SM-2는 망각 직전 복습을 유도한다.</div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 12 }}>
                <span className={`${styles.btag} ${styles.btagWhite}`}>📄 아티클</span>
                <span className={`${styles.btag} ${styles.btagWhite}`}>🎬 YouTube</span>
                <span className={`${styles.btag} ${styles.btagWhite}`}>📱 Instagram</span>
                <span className={`${styles.btag} ${styles.btagWhite}`}>📎 파일</span>
                <span className={`${styles.btag} ${styles.btagWhite}`}>✏️ 텍스트</span>
              </div>
            </div>

            {/* SM-2 — col5 */}
            <div className={`${styles.bentoCard} ${styles.col5}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className={`${styles.bentoIconWrap} ${styles.iconIndigo}`} style={{ fontSize: 18, color: '#132175', marginBottom: 0 }}>⟳</div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#132175', lineHeight: 1 }}>3</div>
                  <div style={{ fontSize: 9, color: '#767683', marginTop: 1 }}>오늘 복습</div>
                </div>
              </div>
              <div className={styles.bentoTitle} style={{ marginTop: 10 }}>SM-2 간격 반복 복습</div>
              <div style={{ fontSize: 10, color: '#136299', fontWeight: 600, marginTop: 2, marginBottom: 12 }}>🔥 12일 연속 학습 중</div>
              <div style={{ display: 'flex', gap: 5 }}>
                <div style={{ flex: 1, padding: 8, borderRadius: 8, background: '#ffdbc8', textAlign: 'center', fontSize: 10, fontWeight: 700, color: '#321300' }}>잊었음<br /><span style={{ opacity: 0.65, fontSize: 9 }}>내일</span></div>
                <div style={{ flex: 1, padding: 8, borderRadius: 8, background: '#cfe5ff', textAlign: 'center', fontSize: 10, fontWeight: 700, color: '#001d33' }}>희미함<br /><span style={{ opacity: 0.65, fontSize: 9 }}>+10일</span></div>
                <div style={{ flex: 1, padding: 8, borderRadius: 8, background: '#132175', textAlign: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>기억남<br /><span style={{ opacity: 0.75, fontSize: 9 }}>+4d→13d</span></div>
              </div>
            </div>

            {/* URL Save — col5 soft-blue */}
            <div className={`${styles.bentoCard} ${styles.softBlueCard} ${styles.col5}`}>
              <div className={`${styles.bentoIconWrap} ${styles.iconIndigo}`} style={{ fontSize: 18, color: '#132175' }}>＋</div>
              <div className={styles.bentoTitle}>URL 하나로 즉시 저장</div>
              <div className={styles.bentoDesc} style={{ marginBottom: 12 }}>링크 붙여넣기로 저장 완료. AI가 자동으로 읽어드립니다.</div>
              {[
                { icon: '🎬', title: 'Y Combinator — 스타트업 아이디어 찾는 법', cat: '비즈니스', time: '방금 전' },
                { icon: '📄', title: '위라클 프로 투자 전략 2025', cat: '투자/경제', time: '1시간 전' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '7px 9px', background: 'rgba(255,255,255,0.7)', borderRadius: 8, marginBottom: 5, border: '1px solid rgba(19,33,117,0.07)' }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#1b1c1c', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                    <div style={{ fontSize: 9, color: '#767683', marginTop: 1 }}>{item.cat} · {item.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Weekly email — col8 */}
            <div className={`${styles.bentoCard} ${styles.col8}`} style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
              <div className={`${styles.bentoIconWrap} ${styles.iconIndigo}`} style={{ flexShrink: 0, marginBottom: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>mail</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className={styles.bentoTitle}>주간 요약 이메일</div>
                <div className={styles.bentoDesc}>매주 월요일 오전 8시, 지난 주 콘텐츠를 이메일로 받아보세요. 이메일 안에서 바로 복습 평가도 가능합니다.</div>
              </div>
              <div style={{ flexShrink: 0, background: '#f5f3f3', borderRadius: 8, padding: '10px 14px', border: '1px solid #e4e2e2', fontSize: 11, color: '#454651', whiteSpace: 'nowrap' }}>
                <span style={{ fontWeight: 600, color: '#132175' }}>스밈 주간 요약</span><br />이번 주 저장 7개 · 복습 대기 3건
              </div>
            </div>

            {/* Category — col4 */}
            <div className={`${styles.bentoCard} ${styles.col4}`}>
              <div className={`${styles.bentoIconWrap} ${styles.iconIndigo}`}>
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>category</span>
              </div>
              <div className={styles.bentoTitle}>자동 카테고리 분류</div>
              <div className={styles.bentoTagRow} style={{ marginTop: 10 }}>
                <span className={`${styles.btag} ${styles.btagIndigo}`}>기술/개발</span>
                <span className={`${styles.btag} ${styles.btagIndigo}`}>비즈니스</span>
                <span className={`${styles.btag} ${styles.btagIndigo}`}>투자/경제</span>
                <span className={`${styles.btag} ${styles.btagGray}`}>라이프스타일</span>
              </div>
            </div>

            {/* Retention — col12 dark */}
            <div className={`${styles.bentoCard} ${styles.darkCard} ${styles.col12}`} style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              <div style={{ flexShrink: 0 }}>
                <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(187,195,255,0.5)', marginBottom: 6 }}>30일 재방문율</div>
                <div style={{ fontSize: 48, fontWeight: 900, color: '#fff', letterSpacing: '-0.05em', lineHeight: 1 }}>
                  30%<span style={{ fontSize: 20, color: '#bbc3ff' }}>↑</span>
                </div>
                <div style={{ fontSize: 10, color: 'rgba(187,195,255,0.6)', marginTop: 4 }}>vs 타사 &lt;10%</div>
              </div>
              <div style={{ flex: 1 }}>
                {[
                  { label: '일반 북마크앱', pct: 10, color: 'rgba(187,195,255,0.25)' },
                  { label: '스밈 (SM-2)', pct: 30, color: '#bbc3ff' },
                ].map(({ label, pct, color }) => (
                  <div key={label} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>{label}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>{pct}%</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ width: `${pct * 3}%`, height: '100%', background: color, borderRadius: 99 }} />
                    </div>
                  </div>
                ))}
                <div className={`${styles.bentoDesc} ${styles.bentoDescLight}`} style={{ fontSize: 11, marginTop: 6 }}>
                  SM-2 간격 반복 알고리즘으로 망각 직전 복습 → 지식이 장기 기억으로 정착됩니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className={`${styles.section} ${styles.howBg}`}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionBadge}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>steps</span>
            사용 방법
          </div>
          <h2 className={styles.sectionH2}>3단계로 시작하세요</h2>
          <p className={styles.sectionSub}>복잡한 설정 없이 URL 하나로 지식 관리를 시작할 수 있습니다.</p>

          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNum}>1</div>
              <div className={styles.stepTitle}>콘텐츠 저장</div>
              <p className={styles.stepDesc}>읽고 싶은 아티클, 유튜브 영상, PDF의 URL을 붙여넣거나 직접 텍스트를 입력하세요. 5가지 형식을 모두 지원합니다.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNum}>2</div>
              <div className={styles.stepTitle}>AI 요약 확인</div>
              <p className={styles.stepDesc}>AI가 자동으로 핵심 내용을 추출하고 구조화된 요약을 생성합니다. 원문을 읽는 시간의 20%로 핵심을 파악하세요.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNum}>3</div>
              <div className={styles.stepTitle}>스케줄 복습</div>
              <p className={styles.stepDesc}>SM-2 알고리즘이 망각 곡선을 분석해 최적의 타이밍에 복습 알림을 보냅니다. 잊기 직전에 다시 만나보세요.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className={`${styles.section} ${styles.socialBg}`}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionBadge}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>groups</span>
            사용자 반응
          </div>
          <h2 className={styles.sectionH2}>이미 많은 분들이<br />기억을 쌓고 있어요</h2>

          <div className={styles.statGrid}>
            {[
              { val: '2,400', unit: '+', label: '활성 사용자' },
              { val: '18만', unit: '', label: '저장된 콘텐츠' },
              { val: '89', unit: '%', label: '30일 기억 보유율' },
              { val: '4.9', unit: '★', label: '평균 만족도' },
            ].map((s, i) => (
              <div key={i} className={styles.statCard}>
                <div className={styles.statNum}>
                  {s.val}<span className={styles.statUnit}>{s.unit}</span>
                </div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className={styles.testimonials}>
            {[
              { q: '예전엔 읽은 걸 금방 잊었는데 스밈으로 체계적으로 복습하니까 정말 기억에 남아요. 주간 리포트 받을 때마다 뿌듯합니다.', name: '김지현', role: '대학원생', color: '#dfe0ff', fg: '#132175' },
              { q: 'URL 붙여넣으면 AI가 다 해줘서 너무 편해요. 복습 알림도 딱 맞는 타이밍에 와서 자연스럽게 기억됩니다.', name: '이민준', role: '프리랜서 개발자', color: '#cfe5ff', fg: '#136299' },
              { q: '유튜브 영상 요약 기능이 특히 좋아요. 2시간짜리 강의도 5분 만에 핵심을 파악할 수 있어서 정말 효율적입니다.', name: '박소연', role: '직장인', color: '#ffdbc8', fg: '#5c2100' },
            ].map((t, i) => (
              <div key={i} className={styles.tcard}>
                <p className={styles.tcardQuote}>&ldquo;{t.q}&rdquo;</p>
                <div className={styles.tcardAuthor}>
                  <div className={styles.tcardAvatar} style={{ background: t.color, color: t.fg }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div className={styles.tcardName}>{t.name}</div>
                    <div className={styles.tcardRole}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className={`${styles.section} ${styles.pricingBg}`}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionBadge}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>sell</span>
            가격 플랜
          </div>
          <h2 className={styles.sectionH2}>합리적인 가격으로<br />시작하세요</h2>
          <p className={styles.sectionSub}>무료로 시작하고, 필요할 때 업그레이드하세요.</p>

          <div className={styles.pricingGrid}>
            {/* Free */}
            <div className={styles.pcard}>
              <div className={styles.pcardTier}>Free</div>
              <div className={styles.pcardPrice}>₩0</div>
              <div className={styles.pcardPer}>영원히 무료</div>
              <div className={styles.pcardDesc}>스밈의 핵심 기능을 무료로 경험해보세요.</div>
              <div className={styles.pcardDivider} />
              <div className={styles.pfeatureList}>
                {['월 20개 콘텐츠 저장', 'AI 요약 (기본)', 'SM-2 복습 알림', '3가지 콘텐츠 유형'].map((f, i) => (
                  <div key={i} className={styles.pfeature}>
                    <span className={`material-symbols-outlined ${styles.pfeatureCheck}`} style={{ fontSize: 18 }}>check_circle</span>
                    {f}
                  </div>
                ))}
                {['주간 이메일 리포트', '무제한 저장'].map((f, i) => (
                  <div key={i} className={styles.pfeature} style={{ opacity: 0.4 }}>
                    <span className={`material-symbols-outlined ${styles.pfeatureCross}`} style={{ fontSize: 18 }}>cancel</span>
                    {f}
                  </div>
                ))}
              </div>
              <Link href="/signup" className={`${styles.pcardBtn} ${styles.pcardBtnOutline}`} style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                무료로 시작
              </Link>
            </div>

            {/* Pro (featured) */}
            <div className={`${styles.pcard} ${styles.pcardFeatured}`}>
              <div className={styles.pcardBadge}>가장 인기</div>
              <div className={`${styles.pcardTier} ${styles.pcardTierLight}`}>Pro</div>
              <div className={`${styles.pcardPrice} ${styles.pcardPriceLight}`}>₩6,900</div>
              <div className={`${styles.pcardPer} ${styles.pcardPerLight}`}>월 / 사용자</div>
              <div className={`${styles.pcardDesc} ${styles.pcardDescLight}`}>지식 관리를 본격적으로 시작하는 분들을 위해</div>
              <div className={`${styles.pcardDivider} ${styles.pcardDividerLight}`} />
              <div className={styles.pfeatureList}>
                {['무제한 콘텐츠 저장', 'AI 요약 (고급)', 'SM-2 복습 + 통계', '5가지 콘텐츠 유형', '주간 이메일 리포트', '우선 고객 지원'].map((f, i) => (
                  <div key={i} className={`${styles.pfeature} ${styles.pfeatureLight}`}>
                    <span className={`material-symbols-outlined ${styles.pfeatureCheckLight}`} style={{ fontSize: 18 }}>check_circle</span>
                    {f}
                  </div>
                ))}
              </div>
              <Link href="/signup" className={`${styles.pcardBtn} ${styles.pcardBtnWhite}`} style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                Pro 시작하기
              </Link>
            </div>

            {/* Annual */}
            <div className={styles.pcard}>
              <div className={styles.pcardTier}>Annual</div>
              <div className={styles.pcardPrice}>₩59,000</div>
              <div className={styles.pcardPer}>연 / 사용자 (29% 절약)</div>
              <div className={styles.pcardDesc}>Pro 모든 기능 + 연간 절약 혜택을 함께 누리세요.</div>
              <div className={styles.pcardDivider} />
              <div className={styles.pfeatureList}>
                {['Pro 모든 기능 포함', '월 대비 29% 절약', '연간 지식 리포트', '우선 고객 지원', '얼리 액세스 기능'].map((f, i) => (
                  <div key={i} className={styles.pfeature}>
                    <span className={`material-symbols-outlined ${styles.pfeatureCheck}`} style={{ fontSize: 18 }}>check_circle</span>
                    {f}
                  </div>
                ))}
              </div>
              <Link href="/signup" className={`${styles.pcardBtn} ${styles.pcardBtnPrimary}`} style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                연간으로 절약하기
              </Link>
            </div>
          </div>
          <p className={styles.pricingNote}>모든 플랜에 14일 무료 체험 포함 · 언제든 해지 가능 · 신용카드 불필요</p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className={`${styles.section} ${styles.contactBg}`}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionBadge}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>support_agent</span>
            문의하기
          </div>
          <h2 className={styles.sectionH2}>궁금한 점이 있으신가요?</h2>
          <p className={styles.sectionSub}>언제든지 문의해주세요. 빠르게 답변드리겠습니다.</p>

          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              {[
                { icon: 'mail', title: '이메일', val: 'hello@smim.app' },
                { icon: 'schedule', title: '응답 시간', val: '영업일 기준 24시간 이내' },
                { icon: 'location_on', title: '위치', val: '대한민국 서울' },
              ].map((item, i) => (
                <div key={i} className={styles.contactItem}>
                  <div className={styles.contactIcon}>
                    <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{item.icon}</span>
                  </div>
                  <div>
                    <div className={styles.contactItemTitle}>{item.title}</div>
                    <div className={styles.contactItemVal}>{item.val}</div>
                  </div>
                </div>
              ))}
              <div style={{ padding: '16px 18px', background: '#fff', borderRadius: 12, border: '1px solid #e4e2e2', marginTop: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#132175', marginBottom: 12 }}>💡 자주 묻는 질문</div>
                {[
                  { q: '무료 플랜과 Pro 플랜의 차이는 무엇인가요?', a: '무료 플랜은 콘텐츠 저장 20개, 기본 복습 기능을 제공합니다. Pro는 무제한 저장, AI 요약, 고급 복습 스케줄링을 지원합니다.' },
                  { q: '업그레이드 시 기존 데이터는 유지되나요?', a: '네, 무료 플랜에서 Pro로 업그레이드해도 모든 데이터는 그대로 유지됩니다.' },
                  { q: '언제든지 취소할 수 있나요?', a: '언제든지 취소 가능하며, 남은 구독 기간만큼 환불해 드립니다.' },
                  { q: '어떤 콘텐츠 형식을 지원하나요?', a: 'YouTube 영상, 웹 아티클, PDF, 직접 작성한 노트 등 다양한 형식을 지원합니다.' },
                  { q: '복습 알림은 어떻게 받나요?', a: '이메일 또는 앱 푸시 알림으로 복습 일정을 안내해 드립니다. 알림 설정은 마이페이지에서 조정할 수 있습니다.' },
                ].map((faq, i, arr) => (
                  <div key={i} style={{ paddingBottom: i < arr.length - 1 ? 10 : 0, marginBottom: i < arr.length - 1 ? 10 : 0, borderBottom: i < arr.length - 1 ? '1px solid #f0eeee' : 'none' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#3a3a4a', marginBottom: 3 }}>{faq.q}</div>
                    <div style={{ fontSize: 12, color: '#767683', lineHeight: 1.6 }}>{faq.a}</div>
                  </div>
                ))}
              </div>
            </div>

            <form className={styles.contactForm} onSubmit={handleContact}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#dfe0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#132175' }}>check_circle</span>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#132175', marginBottom: 6 }}>전송되었습니다!</div>
                  <div style={{ fontSize: 14, color: '#767683' }}>빠른 시일 내에 답변드리겠습니다.</div>
                </div>
              ) : (
                <>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>이름</label>
                      <input className={styles.formInput} type="text" placeholder="홍길동" required />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>이메일</label>
                      <input className={styles.formInput} type="email" placeholder="you@example.com" required />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>문의 유형</label>
                    <select className={styles.formInput} required>
                      <option value="">선택해주세요</option>
                      <option>서비스 이용 문의</option>
                      <option>기술 지원</option>
                      <option>파트너십·제휴</option>
                      <option>기타</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>내용</label>
                    <textarea className={`${styles.formInput} ${styles.formTextarea}`} placeholder="문의 내용을 입력하세요" required />
                  </div>
                  <button type="submit" className={styles.formSubmit}>문의 보내기</button>
                </>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaH2}>지금 바로 시작하세요</h2>
          <p className={styles.ctaSub}>14일 무료 체험, 신용카드 불필요. 지식이 스며드는 경험을 시작해보세요.</p>
          <div className={styles.ctaBtns}>
            <Link href="/signup" className={styles.btnCtaWhite}>무료로 시작하기 →</Link>
            <button className={styles.btnCtaGhost} onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
              플랜 비교하기
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerTop}>
            <div>
              <div className={styles.footerLogo}>
                <div className={styles.footerLogoMark}>
                  <Image src="/logo.png" alt="스밈" width={18} height={18} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                </div>
                <span className={styles.footerLogoText}>스밈</span>
              </div>
              <p className={styles.footerBrandText}>
                지식이 스며드는 곳.<br />
                AI와 과학적 복습 알고리즘으로<br />
                진짜 기억을 만드세요.
              </p>
            </div>
            <div>
              <div className={styles.footerColTitle}>서비스</div>
              <a href="#features" className={styles.footerLink}>기능 소개</a>
              <a href="#pricing" className={styles.footerLink}>가격 플랜</a>
              <a href="#how" className={styles.footerLink}>사용 방법</a>
            </div>
            <div>
              <div className={styles.footerColTitle}>회사</div>
              <a href="#" className={styles.footerLink}>소개</a>
              <a href="#contact" className={styles.footerLink}>문의하기</a>
              <a href="#" className={styles.footerLink}>블로그</a>
            </div>
            <div>
              <div className={styles.footerColTitle}>법적 고지</div>
              <a href="#" className={styles.footerLink}>이용약관</a>
              <a href="#" className={styles.footerLink}>개인정보처리방침</a>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <span className={styles.footerCopy}>© 2025 스밈. All rights reserved.</span>
            <div className={styles.footerSocials}>
              <a href="#" className={styles.footerSocial}>X</a>
              <a href="#" className={styles.footerSocial}>in</a>
              <a href="#" className={styles.footerSocial}>gh</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
